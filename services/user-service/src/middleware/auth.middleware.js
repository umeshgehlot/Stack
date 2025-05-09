/**
 * Check if user is an admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Access denied. Admin privileges required.',
  });
};

/**
 * Check if user is a super admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Access denied. Super admin privileges required.',
  });
};

/**
 * Check if user has an active account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.isActive = (req, res, next) => {
  if (req.user && req.user.status === 'active') {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Account is inactive or suspended. Please contact support.',
  });
};
