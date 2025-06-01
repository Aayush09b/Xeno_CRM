const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  authController.googleAuthCallback
);

// Local auth routes
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/logout',auth, authController.logout);
router.get('/me',auth, authController.getMe);

module.exports = router;