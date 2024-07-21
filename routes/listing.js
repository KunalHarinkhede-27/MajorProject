const express=require("express");
const app=express();
const path=require("path");
const listing=require("../models/listing.js");
const asyncwrap=require("../utill/asyncwrap.js");
const expresserror=require("../utill/expresserror.js");
const {listingschema}=require("../Schema.js");
const router=express.Router();
const flash=require("connect-flash");
const {isLoggedin,isOwner}=require("../middleware.js");
const listingcontroller=require("../controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudconfig.js");
const upload=multer({storage});
//express router is the function which we use for the purpose of spreading/restructuring our route to different files to make our 
//main code simple and not bulky.

//function for checking validation of listingschema in which we define schema by using joi.
const validatelisting=(req,res,next)=>{
    let {error}=listingschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=> el.message).join(",");
        throw new expresserror(400,errmsg);
        }
        else{
            next();
        }
};

//search route

// router
// .route("/search/new")
// .get(asyncwrap(listingcontroller.searchroute))

router 
.route("/search")
.post(asyncwrap(listingcontroller.searchrouten))


//index and showroute
router
.route("/")
.get(asyncwrap(listingcontroller.index))
.post(upload.single("Listing[image]"),validatelisting,asyncwrap(listingcontroller.showrouten));


//new route
router.get("/new",isLoggedin,listingcontroller.newroute);


//show ,update and delete route
router
.route("/:id")
.get(asyncwrap(listingcontroller.showroute))
.patch(isLoggedin,isOwner,upload.single("Listing[image]"),validatelisting,asyncwrap(listingcontroller.updaterouten))
.delete(isLoggedin,isOwner,asyncwrap(listingcontroller.deleteroute));
//show route
//populate is used to convert the data of object into readable form.

//update route

router.get("/:id/update",isLoggedin,isOwner,upload.single("Listing[image]"),asyncwrap(listingcontroller.updateroute));



module.exports=router; 