const listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken="pk.eyJ1Ijoia3VuYWxoYXJpbmtoZWRlMjc3IiwiYSI6ImNsdmNrejFidjA0NmYybG12a3ZzbnIxeTkifQ.Agd3sqT4hvAp0lLde6Zrmg";
const geocodingClient = mbxGeocoding({ accessToken: maptoken });

module.exports.index=async(req,res,next)=>{
    const alllistings=await listing.find({});
    res.render("./listings/index.ejs",{alllistings});
};

// module.exports.searchroute=async(req,res)=>{
//     res.render("./listings/search.ejs");
//     //let alllistings=await listing.find({title:data});
//     // res.render("./listings/index.ejs",{alllistings});
// }

module.exports.searchrouten=async(req,res)=>{
    let {search}=req.body;
    console.log(search)
    let alllistings=await listing.find({title:search});
    console.log(alllistings)
    res.render("./listings/index.ejs",{alllistings});
}

module.exports.newroute=(req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.showroute=async(req,res,next)=>{
    let {id}=req.params;
    const Listing= await listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!Listing){
        req.flash("error","Listing you searched for does not exist. ");
        res.redirect("/listings");
    }
    let response= await geocodingClient.forwardGeocode({
        query: Listing.location,
        limit: 1,
        })
        .send()
    Listing.geometry=response.body.features[0].geometry;
    res.render("listings/show.ejs",{Listing});
};

module.exports.showrouten=async(req,res,next)=>{
    let response= await geocodingClient.forwardGeocode({
        query: req.body.Listing.location,
        limit: 1,
        })
        .send()
    
    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting=new listing(req.body.Listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    newlisting.geometry=response.body.features[0].geometry;
    await newlisting.save();
    req.flash("success","New listing created.");
    res.redirect("/listings");
};

module.exports.updateroute=async(req,res,next)=>{
    let {id}= req.params;
    const Listing=await listing.findById(id);
    if(!Listing){
        req.flash("error","Listing you searched for does not exist. ");
        res.redirect("/listings");
    }
    let originalimageurl=Listing.image.url;
    originalimageurl=originalimageurl.replace("/upload","/upload/h_300,w_300");
    res.render("./listings/update.ejs",{Listing,originalimageurl});
};

module.exports.updaterouten=async(req,res,next)=>{
    let {id}=req.params;
    const Listing=await listing.findByIdAndUpdate(id, {...req.body.Listing});
    if(typeof req.file!="undefined")
    {
    let url=req.file.path;
    let filename=req.file.filename;
    Listing.image={url,filename};
    await Listing.save();
    }
    req.flash("success","listing is updated.");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteroute=async(req,res,next)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("Delete","listing is deleted.");
    res.redirect("/listings");
};



