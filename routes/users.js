const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync"); // updated
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users");

// ➕ Signup routes
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(catchAsync(userController.signup)); // replaced wrapAsync with catchAsync

// ➕ Login routes
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    userController.login
  );

// 🗝️ Logout
router.get("/logout", userController.logout);

module.exports = router;
