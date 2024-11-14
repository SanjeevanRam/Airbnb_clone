const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const review = require("./review.js");

//create schema
const listingSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true,
    },
    description: String,
    image:{
        url: { type: String, required: true },
        filename: { type: String, required: true },
        
    },
    price: Number,
    location: String,
    country: String,
    review:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
        }
    
});

listingSchema.post("findOneAndDelete",async(listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in : listing.review}});
    }
})

//create Model throgh schema
const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;