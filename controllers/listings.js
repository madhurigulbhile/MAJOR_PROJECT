const Listing = require("../models/listing");
const axios = require("axios"); // Make sure: npm install axios

// 🌍 Create a new listing with coordinates
module.exports.createListing = async (req, res, next) => {
  try {
    const { location, country } = req.body.listing;

    // 🗺️ Get coordinates from OpenStreetMap
    const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: `${location}, ${country}`,
        format: "json",
        limit: 1,
      },
    });

    const coordinates = geoRes.data.length
      ? [parseFloat(geoRes.data[0].lon), parseFloat(geoRes.data[0].lat)]
      : [72.8777, 19.0760]; // fallback → Mumbai

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    // Add geometry for Leaflet
    newListing.geometry = {
      type: "Point",
      coordinates: coordinates,
    };

    await newListing.save();
    req.flash("success", "✅ New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// 📜 Show all listings (✅ FIXED FOR CATEGORY FILTER)
// ⭐ UPDATED: Show all listings or filter by category
module.exports.index = async (req, res) => {
  const { category } = req.query;
  let allListings;

  if (category) {
    allListings = await Listing.find({ category });
  } else {
    allListings = await Listing.find({});
  }

  res.render("listings/index.ejs", { allListings, category });
};


// ➕ Render new listing form
module.exports.renderNewForm = (req, res) => {
  const categories = Listing.getCategories(); // ✅ get enum list from model
  res.render("listings/new", { categories });
};

// 🔍 Show single listing
module.exports.showListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "❌ Listing you requested for does not exist!");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  } catch (err) {
    next(err);
  }
};

// ✏️ Render edit form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;

  // Get the listing to edit
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const category = listing.category || null;
  res.render("listings/edit", { listing, category }); // 🔸 Simplified
};

// ♻️ Update listing (with new coordinates if location changed)
module.exports.updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // Update image if new one uploaded
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    // 🗺️ Update coordinates when location changes
    const { location, country } = req.body.listing;
    const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: `${location}, ${country}`,
        format: "json",
        limit: 1,
      },
    });

    if (geoRes.data.length > 0) {
      const { lon, lat } = geoRes.data[0];
      listing.geometry = { type: "Point", coordinates: [parseFloat(lon), parseFloat(lat)] };
    } else if (!listing.geometry || !listing.geometry.coordinates.length) {
      listing.geometry = { type: "Point", coordinates: [72.8777, 19.0760] };
    }

    await listing.save();
    req.flash("success", "✅ Listing Updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
};

// 🗑️ Delete listing
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "🗑️ Listing Deleted!");
  res.redirect("/listings");
};
