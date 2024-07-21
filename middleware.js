const expresserror=require("./utill/expresserror.js");
const {listingschema,reviewschema}=require("./Schema.js");
const listing=require("./models/listing.js");
const review=require("./models/review.js");

module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to make any changes.");
        return res.redirect("/login")
    }
    next();
}

module.exports.saveredirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let Listing=await listing.findById(id);
    if(!Listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of this listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validatelisting=(req,res,next)=>{
    let {error}=listingschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=> el.message).join(",");
        throw new expresserror(400,errmsg);
        }
        else{
            next();
        }
};

module.exports.validatereview=(req,res,next)=>{
    let {error}=reviewschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=> el.message).join(",");
        throw new expresserror(400,errmsg);
        }
        else{
            next();
        }
};

module.exports.isreviewauthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let Review=await review.findById(reviewId);
    if(!Review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of this review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};