const express = require('express');
const passport = require('passport');
const authController = require('../controllers/auth.controller');
const { validateRequest } = require('../middleware/validation.middleware');
const { authValidation } = require('../middleware/validators');

const router = express.Router();

// Register new user
router.post(
  '/register',
  validateRequest(authValidation.register),
  authController.register
);

// Login user
router.post(
  '/login',
  validateRequest(authValidation.login),
  authController.login
);

// Refresh token
router.post(
  '/refresh-token',
  validateRequest(authValidation.refreshToken),
  authController.refreshToken
);

// Verify email
router.get(
  '/verify-email/:token',
  authController.verifyEmail
);

// Forgot password
router.post(
  '/forgot-password',
  validateRequest(authValidation.forgotPassword),
  authController.forgotPassword
);

// Reset password
router.post(
  '/reset-password/:token',
  validateRequest(authValidation.resetPassword),
  authController.resetPassword
);

// Get current user
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  authController.getMe
);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/login' }),
  authController.oauthSuccess
);

// GitHub OAuth routes
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/auth/login' }),
  authController.oauthSuccess
);

// Microsoft OAuth routes
router.get(
  '/microsoft',
  passport.authenticate('microsoft', { scope: ['user.read'] })
);

router.get(
  '/microsoft/callback',
  passport.authenticate('microsoft', { session: false, failureRedirect: '/auth/login' }),
  authController.oauthSuccess
);

module.exports = router;
