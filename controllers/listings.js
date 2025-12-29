const Listing = require("../models/listing");
const axios = require("axios");

/* =========================
   LocationIQ Geocoding
========================= */
async function geocodeLocation(location, country) {
  try {
    const response = await axios.get(
      "https://us1.locationiq.com/v1/search",
      {
        params: {
          key: process.env.LOCATIONIQ_TOKEN,
          q: `${location}, ${country}`,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "listing-app",
        },
      }
    );

    if (!response.data || response.data.length === 0) return null;

    return {
      type: "Point",
      coordinates: [
        parseFloat(response.data[0].lon),
        parseFloat(response.data[0].lat),
      ],
    };
  } catch (err) {
    console.error("LocationIQ error:", err.message);
    return null;
  }
}

/* =========================
   Controllers
========================= */

module.exports.index = async (req, res) => {
  let allListing = await Listing.find().sort({ _id: -1 });
  res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
  const geometry = await geocodeLocation(
    req.body.listing.location,
    req.body.listing.country
  );

  if (!geometry) {
    req.flash("error", "Location not found!");
    return res.redirect("/listings/new");
  }

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = geometry;

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }

  let originalImage = listing.image.url.replace(
    "/upload",
    "/upload/w_200,h_150"
  );

  res.render("listings/edit.ejs", { listing, originalImage });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, req.body.listing, {
    new: true,
  });

  const geometry = await geocodeLocation(
    req.body.listing.location,
    req.body.listing.country
  );

  if (geometry) {
    listing.geometry = geometry;
  }

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

/* =========================
   Filter & Search (UNCHANGED)
========================= */

module.exports.filter = async (req, res) => {
  let { id } = req.params;
  let allListing = await Listing.find({ category: { $all: [id] } });

  if (allListing.length !== 0) {
    res.locals.success = `Listings found by ${id}`;
    res.render("listings/index.ejs", { allListing });
  } else {
    req.flash("error", "Listings not found!");
    res.redirect("/listings");
  }
};

module.exports.filterbtn = (req, res) => {
  res.render("listings/filterbtn.ejs");
};

module.exports.search = async (req, res) => {
  let input = req.query.q.trim().replace(/\s+/g, " ");

  if (!input) {
    req.flash("error", "Search value empty!");
    return res.redirect("/listings");
  }

  let allListing = await Listing.find({
    title: { $regex: input, $options: "i" },
  });

  if (allListing.length) {
    return res.render("listings/index.ejs", { allListing });
  }

  req.flash("error", "Listings not found!");
  res.redirect("/listings");
};
