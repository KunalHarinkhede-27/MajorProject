const mongoose=require("mongoose");
const review = require("./review");
const { string, required, number } = require("joi");
const Schema=mongoose.Schema;


const listingschema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true,
        },
        coordinates:{
            type:[Number],
            required:true,
        }
    },
    // category:{
    //     type:{
    //         type:String,
    //         required:true,
    //     }
    // }
});

listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in:listing.reviews}});
    }
})

const listing=mongoose.model("listing",listingschema);
module.exports=listing;
