const express = require("express");
const router = express.Router();
const multer = require("multer");
const { cloudinary, storage } = require("../cloudConfig");
const upload = multer({ storage });

const listings = require("../controllers/listings");
const { isLoggedIn, isOwner } = require("../middleware");

// 🌟 Show all listings (with optional category)
router.get("/", listings.index);

// ➕ New listing form
router.get("/new", isLoggedIn, listings.renderNewForm);

// ✏️ Create listing
router.post("/", isLoggedIn, upload.single("image"), listings.createListing);

// 🔍 Show a single listing
router.get("/:id", listings.showListing);

// ✏️ Edit listing form
router.get("/:id/edit", isLoggedIn, isOwner, listings.renderEditForm);

// ♻️ Update listing
router.put("/:id", isLoggedIn, isOwner, upload.single("image"), listings.updateListing);

// 🗑️ Delete listing
router.delete("/:id", isLoggedIn, isOwner, listings.deleteListing);

module.exports = router;


