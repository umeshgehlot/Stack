const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user.model');
const config = require('../config');

/**
 * Generate JWT tokens for authentication
 * @param {Object} user - User object
 * @returns {Object} - Access and refresh tokens
 */
const generateTokens = (user) => {
  const payload = user.toAuthJSON();
  
  // Generate access token
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
  
  // Generate refresh token
  const refreshToken = jwt.sign({ id: user._id }, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
  
  return { accessToken, refreshToken };
};

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, company } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered',
      });
    }
    
    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      company,
      verificationToken,
    });
    
    await user.save();
    
    // TODO: Send verification email
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toAuthJSON(),
        tokens: { accessToken, refreshToken },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Login a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
    
    // Check if user has a password (OAuth users might not have one)
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'This account uses social login. Please sign in with the appropriate provider.',
      });
    }
    
    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
    
    // Update last login timestamp
    user.lastLogin = Date.now();
    await user.save();
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toAuthJSON(),
        tokens: { accessToken, refreshToken },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Refresh access token using refresh token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }
    
    // Verify refresh token
    jwt.verify(refreshToken, config.jwt.secret, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired refresh token',
        });
      }
      
      // Find user
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }
      
      // Generate new tokens
      const tokens = generateTokens(user);
      
      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          tokens,
        },
      });
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Verify email with verification token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    // Find user with matching verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }
    
    // Update user
    user.isEmailVerified = true;
    user.verificationToken = undefined;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Request password reset
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Set reset token and expiry
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    
    // TODO: Send password reset email
    
    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Reset password with reset token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    // Find user with matching reset token and valid expiry
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }
    
    // Update password and clear reset token
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Handle OAuth success and redirect to frontend with tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.oauthSuccess = (req, res) => {
  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(req.user);
  
  // Redirect to frontend with tokens
  res.redirect(
    `${config.frontendURL}/auth/oauth-callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
  );
};

/**
 * Get current user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getMe = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user.toAuthJSON(),
    },
  });
};
