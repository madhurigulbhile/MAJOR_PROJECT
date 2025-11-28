const Listing = require("../models/listing");
const { getCoordinates } = require("../utils/geocode");

// ➕ Create a new listing
module.exports.createListing = async (req, res, next) => {
  try {
    const { location, country } = req.body.listing;

    const coordinates = await getCoordinates(location, country);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    newListing.geometry = {
      type: "Point",
      coordinates,
    };

    await newListing.save();
    req.flash("success", "✅ New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    next(err);
  }
};

// ♻️ Update listing
module.exports.updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

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
  } catch (err) {
    next(err);
  }
};

// 🌟 Show all listings
module.exports.index = async (req, res) => {
  const { category } = req.query;
  const allListings = category
    ? await Listing.find({ category })
    : await Listing.find({});
  res.render("listings/index.ejs", { allListings, category });
};

// ➕ Render new form
module.exports.renderNewForm = (req, res) => {
  const categories = Listing.getCategories();
  res.render("listings/new", { categories });
};

// 🔍 Show single listing
module.exports.showListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");

    if (!listing) {
      req.flash("error", "❌ Listing not found!");
      return res.redirect("/listings");
    }

    // Pass Map API Key to EJS
    res.render("listings/show.ejs", {
      listing,
      mapApiKey: process.env.MAP_API_KEY,
    });

  } catch (err) {
    next(err);
  }
};

// ✏️ Render edit form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const category = listing.category || null;
  res.render("listings/edit", { listing, category });
};

// 🗑️ Delete listing
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "🗑️ Listing Deleted!");
  res.redirect("/listings");
};
