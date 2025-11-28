const Listing = require("../models/listing");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

// ➕ Create Review
module.exports.createReview = catchAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new ExpressError(404, "Listing not found");

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "✅ New Review Created!");
  res.redirect(`/listings/${listing._id}`);
});

// 🗑️ Delete Review
module.exports.deleteReview = catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError(404, "Listing not found");

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "✅ Review Deleted!");
  res.redirect(`/listings/${id}`);
});
