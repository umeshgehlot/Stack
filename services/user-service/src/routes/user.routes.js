const express = require('express');
const passport = require('passport');
const userController = require('../controllers/user.controller');
const { validateRequest } = require('../middleware/validation.middleware');
const { userValidation } = require('../middleware/validators');
const { isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply JWT authentication to all routes
router.use(passport.authenticate('jwt', { session: false }));

// Get all users (admin only)
router.get(
  '/',
  isAdmin,
  userController.getAllUsers
);

// Get user by ID (self or admin)
router.get(
  '/:id',
  userController.getUserById
);

// Update user profile
router.put(
  '/:id',
  validateRequest(userValidation.updateProfile),
  userController.updateProfile
);

// Change password
router.put(
  '/:id/change-password',
  validateRequest(userValidation.changePassword),
  userController.changePassword
);

// Delete user (self or admin)
router.delete(
  '/:id',
  userController.deleteUser
);

module.exports = router;
