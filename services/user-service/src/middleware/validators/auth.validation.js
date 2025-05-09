const Joi = require('joi');

// Register validation schema
const register = Joi.object({
  name: Joi.string().required().min(2).max(100).trim()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters',
    }),
  email: Joi.string().required().email().trim().lowercase()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
    }),
  password: Joi.string().required().min(8).max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password cannot exceed 128 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
  company: Joi.object({
    name: Joi.string().allow('').max(100).trim(),
    size: Joi.string().valid('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'),
    role: Joi.string().allow('').max(100).trim(),
  }),
});

// Login validation schema
const login = Joi.object({
  email: Joi.string().required().email().trim().lowercase()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
    }),
  password: Joi.string().required()
    .messages({
      'string.empty': 'Password is required',
    }),
});

// Refresh token validation schema
const refreshToken = Joi.object({
  refreshToken: Joi.string().required()
    .messages({
      'string.empty': 'Refresh token is required',
    }),
});

// Forgot password validation schema
const forgotPassword = Joi.object({
  email: Joi.string().required().email().trim().lowercase()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
    }),
});

// Reset password validation schema
const resetPassword = Joi.object({
  password: Joi.string().required().min(8).max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password cannot exceed 128 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password'))
    .messages({
      'string.empty': 'Confirm password is required',
      'any.only': 'Passwords do not match',
    }),
});

module.exports = {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
};
