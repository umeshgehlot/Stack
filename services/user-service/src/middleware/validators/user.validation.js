const Joi = require('joi');

// Update profile validation schema
const updateProfile = Joi.object({
  name: Joi.string().min(2).max(100).trim()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters',
    }),
  avatar: Joi.string().uri().allow('').trim()
    .messages({
      'string.uri': 'Avatar must be a valid URL',
    }),
  company: Joi.object({
    name: Joi.string().allow('').max(100).trim(),
    size: Joi.string().valid('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'),
    role: Joi.string().allow('').max(100).trim(),
  }),
  preferences: Joi.object({
    theme: Joi.string().valid('light', 'dark', 'system'),
    notifications: Joi.object({
      email: Joi.boolean(),
      push: Joi.boolean(),
      marketing: Joi.boolean(),
    }),
    language: Joi.string().min(2).max(10),
  }),
  // Admin-only fields
  role: Joi.string().valid('user', 'admin', 'superadmin'),
  status: Joi.string().valid('active', 'inactive', 'suspended'),
});

// Change password validation schema
const changePassword = Joi.object({
  currentPassword: Joi.string().required()
    .messages({
      'string.empty': 'Current password is required',
    }),
  newPassword: Joi.string().required().min(8).max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'New password must be at least 8 characters long',
      'string.max': 'New password cannot exceed 128 characters',
      'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
  confirmPassword: Joi.string().required().valid(Joi.ref('newPassword'))
    .messages({
      'string.empty': 'Confirm password is required',
      'any.only': 'Passwords do not match',
    }),
});

module.exports = {
  updateProfile,
  changePassword,
};
