const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError= require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");

// Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing!");
    return res.redirect("/login");
  }
  next();
};

// Save redirect URL for after login
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// Check if the logged-in user owns the listing
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  // If user not logged in or not the owner
  if (!res.locals.currUser || !listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }

  next(); // Proceed if ownership verified
};

module.exports.validateListing = (req, res, next) => {
   let {error} = listingSchema.validate(req.body);
 if(error){
  let errMsg = error.details.map((el) => el.message).join(",");
  throw new ExpressError(400,errMsg);
 } else{
   next();
 }
};

module.exports.validateReview = (req, res, next) => {
   let {error} = reviewSchema.validate(req.body);
 if(error){
  let errMsg = error.details.map((el) => el.message).join(",");
  throw new ExpressError(400,errMsg);
 } else{
   next();
 }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id,reviewId } = req.params;
  const review = await Review.findById(reviewId);

  // If user not logged in or not the owner
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this listing!");
    return res.redirect(`/listings/${id}`);
  }

  next(); // Proceed if ownership verified
};