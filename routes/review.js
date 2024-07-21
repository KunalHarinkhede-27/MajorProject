const express=require("express");
const asyncwrap=require("../utill/asyncwrap.js");
const expresserror=require("../utill/expresserror.js");
const {reviewschema}=require("../Schema.js");
const review=require("../models/review.js");
const router=express.Router({mergeParams:true});
const listing=require("../models/listing.js");
const flash=require("connect-flash");
const {isLoggedin,isreviewauthor}=require("../middleware.js");
const reviewcontroller=require("../controllers/review.js");


const validatereview=(req,res,next)=>{
    let {error}=reviewschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=> el.message).join(",");
        throw new expresserror(400,errmsg);
        }
        else{
            next();
        }
};

//review route
router.post("/",isLoggedin,validatereview,asyncwrap(reviewcontroller.newreview));

//review delete route
router.delete("/:reviewId",isLoggedin,isreviewauthor,asyncwrap(reviewcontroller.destroyreview));

module.exports=router;

