const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

// ➕ Render Signup Form
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

// ➕ Signup User
module.exports.signup = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;
  const newUser = new User({ email, username });
  const registeredUser = await User.register(newUser, password);

  req.login(registeredUser, (err) => {
    if (err) return next(err);
    req.flash("success", "✅ Welcome to Wanderlust!");
    res.redirect("/listings");
  });
});

// ➕ Render Login Form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

// ➕ Login User
module.exports.login = (req, res) => {
  req.flash("success", "✅ Welcome back to Wanderlust!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// 🗝️ Logout User
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "✅ You are logged out!");
    res.redirect("/listings");
  });
};
