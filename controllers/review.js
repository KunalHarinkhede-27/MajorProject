const listing=require("../models/listing.js");
const review=require("../models/review.js");

module.exports.newreview=async(req,res)=>{
    let Listing=await listing.findById(req.params.id);
    let newreview=new review(req.body.review);
    newreview.author=req.user._id;
    Listing.reviews.push(newreview);
    await newreview.save();
    await Listing.save();
    req.flash("success","New review added.");
    res.redirect(`/listings/${Listing._id}`);
};

module.exports.destroyreview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("Delete","review deleted.");
    res.redirect(`/listings/${id}`);
};