const Joi = require('joi');
const Listing = require('./models/listing');
const Review = require("./models/review.js");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().allow("", null),
    price: Joi.number().required().min(0),
    category: Joi.string().required(), // ✅ added this line
    image: Joi.object({
      url: Joi.string().allow("", null)
    }).allow(null)
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});
