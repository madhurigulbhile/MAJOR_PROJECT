const axios = require("axios");

const geocode = async (address) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    const response = await axios.get(url);

    if (!response.data.results || response.data.results.length === 0) {
      throw new Error("Location not found");
    }

    return response.data.results[0].geometry.location; // { lat, lng }
  } catch (error) {
    console.error("Geocode Error:", error.message);
    throw error;
  }
};

module.exports = geocode;
