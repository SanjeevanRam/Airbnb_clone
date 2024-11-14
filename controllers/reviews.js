const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReviews = async( req,res ) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.review.push(newReview);

    await newReview.save(); 
    await listing.save();
    req.flash("success","New Review Added!");
    console.log("New review is save");
    res.redirect(`/listings/${listing.id}`)
}

module.exports.deleteReviews = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{ review:reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review Deleted!");
    res.redirect(`/listings/${id}`)
}
