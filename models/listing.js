const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    image: {
      url: String,
      filename: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // GeoJSON coordinates for maps
    geometry: {
      type: {
        type: String,
        enum: ["Point"], // must be "Point"
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    // Category enum
    category: {
      type: String,
      enum: [
        "Trending",
        "Rooms",
        "Iconic Cities",
        "Mountains",
        "Castles",
        "Amazing Pools",
        "Camping",
        "Farms",
        "Arctic",
      ],
      required: true,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

// Delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: { $in: doc.reviews },
    });
  }
});

// Static helper to get categories
listingSchema.statics.getCategories = function () {
  return this.schema.path("category").enumValues;
};

module.exports = mongoose.model("Listing", listingSchema);
