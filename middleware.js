const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) =>{
    try{
        if(!req.isAuthenticated()){
            req.session.redirectUrl = req.originalUrl;
            req.flash("error","You must be logged in");
            return res.redirect("/login");
        }
        next();
    }catch(e){
        console.error("Error in isLoggedIn middleware:",e);
        return res.status(500).send("Internal Server Error"); // Handle the error appropriately

    }
};

module.exports.saveRedirectUrl = (req, res, next) =>{
    // Check if there is a redirect URL stored in the session
    try{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}catch(e){
    console.error("Error in saveRedirectUrl middleware:", e);
    return res.status(500).send("Internal Server Error"); // Handle the error appropriately
    }
};

module.exports.isOwner = async( req, res, next ) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You don't have permission!, You are not Owner of this Listing!");
    return res.redirect(`/listings/${id}`);
   }
    next();
}


//Listing Schema
module.exports.validateListing = (req, res, next ) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(errMsg, 400);
    }
    next();
}

//Review Schema
module.exports.validateReview = (req, res, next ) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(errMsg, 400);
    }else{
    next();
}
}  

module.exports.isReviewAuthor = async( req,res,next ) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    const currUser  = res.locals.currUser ;

    if( !currUser || !review.author.equals(res.locals.currUser._id)){
        req.flash( "error","You are not author of this review!" );
        return res.redirect(`/listings/${id}`);
    }
    next();
}
