const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const catchAsync = require("../utils/catchAsync"); // updated
const reviewController = require("../controllers/reviews");

// ➕ POST Review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(reviewController.createReview)
);

// 🗑️ DELETE Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviewController.deleteReview)
);

module.exports = router;
