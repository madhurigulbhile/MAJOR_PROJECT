if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const csrf = require("csurf");
const connectDB = require("./db");

const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

const app = express();

// =====================
// MongoDB Atlas Connection
// =====================
connectDB();

// =====================
// Express Config
// =====================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// =====================
// Session & Flash
// =====================
const sessionOptions = {
  store: MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    touchAfter: 24 * 3600,
  }),
  secret: process.env.SECRET || "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// =====================
// Passport Config
// =====================
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// =====================
// CSRF Middleware
// =====================
app.use(csrf());
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.csrfToken = req.csrfToken();
  next();
});

// =====================
// Routes
// =====================
app.use("/", userRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

// =====================
// 404 Handler
// =====================
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// =====================
// Error Handler
// =====================
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  if (process.env.NODE_ENV !== "production") console.error(err);
  res.status(statusCode).render("error", { message, statusCode });
});

module.exports = app;
