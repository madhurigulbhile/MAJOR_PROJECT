// 🌿 seeds.js — Seed sample listings into MongoDB

const mongoose = require("mongoose");
const Listing = require("./models/listing"); // ✅ make sure this path is correct
require("dotenv").config(); // ✅ loads .env for Atlas connection

// ✅ Choose MongoDB URL — Atlas or Local
const dbUrl = process.env.ATLAS_DB_URL || "mongodb://127.0.0.1:27017/major_project";

// ✅ Connect to MongoDB
mongoose.connect(dbUrl)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ✅ Sample Listings
const sampleListings = [
  {
    title: "Luxury Beachside Villa",
    description: "Relax in this stunning villa with a private pool and direct beach access.",
    price: 12500,
    country: "India",
    location: "Goa",
    category: "Trending",
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1723457890/goa-villa.jpg",
      filename: "goa-villa"
    },
    geometry: { type: "Point", coordinates: [73.7400, 15.4909] }
  },
  {
    title: "Royal Castle Stay",
    description: "Live like royalty in a 17th-century heritage castle with guided tours and royal cuisine.",
    price: 8500,
    country: "India",
    location: "Jaipur, Rajasthan",
    category: "Castles",
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1723457890/jaipur-castle.jpg",
      filename: "jaipur-castle"
    },
    geometry: { type: "Point", coordinates: [75.7873, 26.9124] }
  },
  {
    title: "Himalayan Adventure Cabin",
    description: "Enjoy breathtaking views of the Himalayas in a cozy wooden cabin.",
    price: 3500,
    country: "India",
    location: "Manali, Himachal Pradesh",
    category: "Mountains",
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1723457890/himalayan-cabin.jpg",
      filename: "himalayan-cabin"
    },
    geometry: { type: "Point", coordinates: [77.189, 32.243] }
  },
  {
    title: "Countryside Farmhouse",
    description: "Reconnect with nature in this peaceful farmhouse surrounded by lush fields.",
    price: 2800,
    country: "India",
    location: "Nashik, Maharashtra",
    category: "Farms",
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1723457890/farmhouse.jpg",
      filename: "farmhouse"
    },
    geometry: { type: "Point", coordinates: [73.789, 19.997] }
  },
  {
    title: "Skyline City Apartment",
    description: "A modern apartment with panoramic city views and high-end facilities.",
    price: 7500,
    country: "India",
    location: "Mumbai, Maharashtra",
    category: "Iconic Cities",
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1723457890/mumbai-apartment.jpg",
      filename: "mumbai-apartment"
    },
    geometry: { type: "Point", coordinates: [72.8777, 19.0760] }
  },
  {
    title: "Snow Cabin in the Arctic",
    description: "Experience the magic of the Northern Lights in a cozy snow cabin.",
    price: 12000,
    country: "Norway",
    location: "Tromsø",
    category: "Arctic",
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1723457890/arctic-cabin.jpg",
      filename: "arctic-cabin"
    },
    geometry: { type: "Point", coordinates: [18.9553, 69.6492] }
  },
  {
    title: "Lakeside Camping Retreat",
    description: "A calm campsite by the lake with kayaking and bonfire nights.",
    price: 1800,
    country: "India",
    location: "Pawna Lake, Lonavala",
    category: "Camping",
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1723457890/pawna-camp.jpg",
      filename: "pawna-camp"
    },
    geometry: { type: "Point", coordinates: [73.4368, 18.6773] }
  },
  {
    title: "Infinity Pool Resort",
    description: "Chill by an infinity pool overlooking lush green hills.",
    price: 9500,
    country: "India",
    location: "Munnar, Kerala",
    category: "Amazing Pools",
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1723457890/munnar-pool.jpg",
      filename: "munnar-pool"
    },
    geometry: { type: "Point", coordinates: [77.0600, 10.0889] }
  }
];

// ✅ Insert Data
const seedDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(sampleListings);
  console.log("✅ Database seeded successfully!");
};

seedDB().then(() => mongoose.connection.close());
