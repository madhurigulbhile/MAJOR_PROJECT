const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// Render signup form
router.get('/Signup', (req, res) => {
  res.render('signup', { title: 'Sign Up' });
});

// Handle signup
router.post('/Signup', async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    const user = new User({ username, email, firstName, lastName });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash('success', 'Welcome! Your account has been created.');
      res.redirect('/');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/Signup');
  }
});

// Render login form
router.get('/Login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Handle login
router.post('/Login', passport.authenticate('local', {
  failureRedirect: '/Login',
  failureFlash: true
}), (req, res) => {
  req.flash('success', 'Welcome back!');
  res.redirect('/');
});

// Logout
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success', 'Logged out successfully!');
    res.redirect('/');
  });
});

module.exports = router;
