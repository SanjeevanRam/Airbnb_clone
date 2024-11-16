const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
  }

module.exports.showListings = async( req,res )=>{
    let{ id } = req.params;
    const listing = await Listing.findById( id )
    .populate({
        path: "review", 
          populate:{
           path: "author",
          }, 
        })
    .populate( "owner" );
    if( !listing ){
        req.flash("error","Listing Does Not Exist!");
        return res.redirect( "/listings" );
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createListings = async(req,res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    console.log(req.user);

    newListing.owner = req.user._id;
    newListing.image = {url,filename};

    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditFrom = async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    req.flash("success","Listing Edited!");
    if(!listing){
        req.flash("error","Listing Does Not Exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing , originalImageUrl});
}

module.exports.updateListings = async( req,res ) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate( id,{ ...req.body.listing });
    if( typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success"," Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListings =  async( req,res ) => {
    let {id} = req.params;
    let deletelistings = await Listing.findByIdAndDelete( id );
    req.flash("success","Listing deleted!");
    console.log( deletelistings );
    res.redirect("/listings");
}