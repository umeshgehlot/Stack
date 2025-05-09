require('dotenv').config();

module.exports = {
  // MongoDB connection string
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/stack-user-service',
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'stack-super-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  // OAuth configurations
  oauth: {
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    },
    github: {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/api/auth/github/callback',
    },
    microsoft: {
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: process.env.MICROSOFT_CALLBACK_URL || 'http://localhost:5000/api/auth/microsoft/callback',
    },
  },
  
  // Email configuration
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    from: process.env.EMAIL_FROM || 'noreply@stack.com',
  },
  
  // Environment
  env: process.env.NODE_ENV || 'development',
  
  // Frontend URL for redirects
  frontendURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
