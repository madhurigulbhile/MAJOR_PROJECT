if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");
const listingRouter = require("./routers/listing.js");
const reviewRouter = require("./routers/review.js");
const userRouter = require("./routers/user.js");
const profileRouter = require("./routers/profile.js");

const app = express();
const PORT = 8080;
const DB_URL = process.env.ATLASDB_URL;

// ------------------- MIDDLEWARE -------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session store
const store = MongoStore.create({
  mongoUrl: DB_URL,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600,
});
store.on("error", (err) => console.log("❌ Session store error:", err));

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};
app.use(session(sessionOptions));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash & current user middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ------------------- ROUTES -------------------
app.use("/", userRouter);
app.use("/profile", profileRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

// 404 handler
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});

// ------------------- DATABASE & SERVER -------------------
async function startServer() {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true, // for Atlas
    });
    console.log("✅ Connected to DB");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to DB:", err);
  }
}

// Call the function to start everything
startServer();