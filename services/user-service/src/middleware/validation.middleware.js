/**
 * Validate request data against a Joi schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
exports.validateRequest = (schema) => {
  return (req, res, next) => {
    if (!schema) return next();
    
    const { error } = schema.validate(req.body, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown fields
    });
    
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessage,
      });
    }
    
    next();
  };
};
