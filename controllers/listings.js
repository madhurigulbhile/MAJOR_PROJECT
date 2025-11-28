const Listing = require("../models/listing");
const { getCoordinates } = require("../utils/geocode");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
// controllers/listings.js
const geocode = require('../utils/geocode'); // make sure the path matches


// 🌟 Show all listings
module.exports.index = catchAsync(async (req, res) => {
  const { category } = req.query;
  const allListings = category
    ? await Listing.find({ category })
    : await Listing.find({});
  res.render("listings/index.ejs", { allListings, category });
});

// ➕ Render new form
module.exports.renderNewForm = (req, res) => {
  const categories = Listing.getCategories();
  res.render("listings/new", { categories });
};

// 🔍 Show single listing
module.exports.showListing = catchAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) throw new ExpressError(404, "❌ Listing not found!");
  res.render("listings/show.ejs", {
    listing,
    mapApiKey: process.env.MAP_API_KEY,
  });
});

// ➕ Create a new listing
module.exports.createListing = catchAsync(async (req, res) => {
  const { location, country } = req.body.listing;

  // ⭐ 1. Combine location + country for Google search
  const fullAddress = `${location}, ${country}`;

  // ⭐ 2. Get coordinates using Google Maps API
  const coordinates = await geocode(fullAddress); // returns { lat, lng }

  // ⭐ 3. Create new listing
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  // ⭐ 4. Image upload (single image)
  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  // ⭐ 5. Save geometry in [lng, lat] format (GeoJSON)
  newListing.geometry = {
    type: "Point",
    coordinates: [coordinates.lng, coordinates.lat],
  };

  await newListing.save();

  req.flash("success", "✅ New Listing Created!");
  res.redirect(`/listings/${newListing._id}`);
});


// ✏️ Render edit form
module.exports.renderEditForm = catchAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) throw new ExpressError(404, "Listing not found!");

  const category = listing.category || null;
  res.render("listings/edit", { listing, category });
});

// ♻️ Update listing
module.exports.updateListing = catchAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError(404, "❌ Listing not found!");

  listing.set(req.body.listing);

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  const { location, country } = req.body.listing;
  const coordinates = await getCoordinates(location, country);
  listing.geometry = { type: "Point", coordinates };

  await listing.save();
  req.flash("success", "✅ Listing Updated!");
  res.redirect(`/listings/${id}`);
});

// 🗑️ Delete listing
module.exports.deleteListing = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "🗑️ Listing Deleted!");
  res.redirect("/listings");
});
