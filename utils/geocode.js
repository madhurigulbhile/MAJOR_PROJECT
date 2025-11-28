const axios = require("axios");

// Function to get coordinates from Google Maps API
const geocode = async (address) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY; // store in env variable
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    const response = await axios.get(url);

    if (!response.data.results || response.data.results.length === 0) {
      throw new Error("Location not found");
    }

    const location = response.data.results[0].geometry.location; // { lat, lng }
    return location;
  } catch (err) {
    console.error("Geocoding error:", err.message);
    throw err;
  }
};

module.exports = geocode;
