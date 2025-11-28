const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// Helper to detect AJAX / fetch requests
const isAjax = (req) => req.xhr || req.headers.accept.includes("json");

// ==============================
// Check if user is logged in
// ==============================
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    if (isAjax(req)) return res.status(403).json({ error: "You must be logged in" });
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to perform this action!");
    return res.redirect("/login");
  }
  next();
};

// ==============================
// Save redirect URL after login
// ==============================
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl; // Clear after saving
  }
  next();
};

// ==============================
// Check if user owns the listing
// ==============================
module.exports.isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      if (isAjax(req)) return res.status(404).json({ error: "Listing not found" });
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    if (!req.user) {
      if (isAjax(req)) return res.status(403).json({ error: "You must be logged in" });
      req.flash("error", "You must be logged in");
      return res.redirect("/login");
    }

    if (!listing.owner.equals(req.user._id)) {
      if (isAjax(req)) return res.status(403).json({ error: "You are not the owner of this listing" });
      req.flash("error", "You are not the owner of this listing!");
      return res.redirect(`/listings/${id}`);
    }

    next();
  } catch (err) {
    next(err);
  }
};

// ==============================
// Validate listing data
// ==============================
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body.listing);
  if (error) throw new ExpressError(400, error.details.map(el => el.message).join(", "));
  next();
};

// ==============================
// Validate review data
// ==============================
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body.review);
  if (error) throw new ExpressError(400, error.details.map(el => el.message).join(", "));
  next();
};

// ==============================
// Check if user is the review author
// ==============================
module.exports.isReviewAuthor = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
      if (isAjax(req)) return res.status(404).json({ error: "Review not found" });
      req.flash("error", "Review not found!");
      return res.redirect(`/listings/${id}`);
    }

    if (!req.user) {
      if (isAjax(req)) return res.status(403).json({ error: "You must be logged in" });
      req.flash("error", "You must be logged in");
      return res.redirect("/login");
    }

    if (!review.author.equals(req.user._id)) {
      if (isAjax(req)) return res.status(403).json({ error: "You are not the author of this review" });
      req.flash("error", "You are not the author of this review!");
      return res.redirect(`/listings/${id}`);
    }

    next();
  } catch (err) {
    next(err);
  }
};
