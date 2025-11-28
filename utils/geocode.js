const axios = require("axios");

// Simple in-memory cache to avoid repeated API calls
const cache = {};
const REQUEST_DELAY = 1500; // 1.5 seconds between requests

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getCoordinates(location, country) {
  const key = `${location},${country}`;
  if (cache[key]) return cache[key]; // Return cached result

  try {
    await delay(REQUEST_DELAY); // Rate-limiting

    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: { q: key, format: "json", limit: 1 },
      headers: {
        "User-Agent": "MajorProjectApp/1.0 (gulbhilemadhuri35@gmail.com)", // MUST identify your app
        "Referer": "https://major-project-180k.onrender.com",          // Optional but recommended
      },
    });

    if (res.data.length > 0) {
      const { lon, lat } = res.data[0];
      cache[key] = [parseFloat(lon), parseFloat(lat)];
      return cache[key];
    }

    // Fallback coordinates
    return [72.8777, 19.0760];
  } catch (err) {
    console.error("Geocoding error:", err.response?.status, err.response?.statusText || err.message);
    return [72.8777, 19.0760]; // fallback
  }
}

module.exports = { getCoordinates };

