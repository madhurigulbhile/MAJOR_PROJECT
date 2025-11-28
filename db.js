// db.js
const mongoose = require("mongoose");

// Optional: disable strictQuery deprecation warnings
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const dbUrl = process.env.ATLASDB_URL;
    const dbName = process.env.DB_NAME || "wanderlust_dev"; // ✅ environment-specific DB

    if (!dbUrl) {
      throw new Error("❌ ATLASDB_URL not set in environment variables!");
    }

    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      dbName,
    });

    console.log(`✅ MongoDB connected: ${dbName}`);

    // Connection events for debugging
    mongoose.connection.on("connected", () => {
      console.log("🟢 Mongoose default connection open");
    });

    mongoose.connection.on("error", (err) => {
      console.error("🔴 Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("🟡 Mongoose default connection disconnected");
    });

  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
