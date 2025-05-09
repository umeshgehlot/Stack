const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const User = require('../models/user.model');
const config = require('./index');

module.exports = (passport) => {
  // JWT Strategy for token authentication
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt.secret,
  };

  passport.use(
    new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload.id).select('-password');
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );

  // Google OAuth Strategy
  if (config.oauth.google.clientID && config.oauth.google.clientSecret) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: config.oauth.google.clientID,
          clientSecret: config.oauth.google.clientSecret,
          callbackURL: config.oauth.google.callbackURL,
          scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user already exists
            let user = await User.findOne({ 'google.id': profile.id });

            if (user) {
              // Update user information if needed
              user.google.token = accessToken;
              user.lastLogin = Date.now();
              await user.save();
              return done(null, user);
            }

            // Check if user exists with the same email
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
              // Link Google account to existing user
              user.google = {
                id: profile.id,
                token: accessToken,
              };
              user.lastLogin = Date.now();
              await user.save();
              return done(null, user);
            }

            // Create new user
            const newUser = new User({
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0].value,
              google: {
                id: profile.id,
                token: accessToken,
              },
              isEmailVerified: true, // Google already verified the email
              lastLogin: Date.now(),
            });

            await newUser.save();
            return done(null, newUser);
          } catch (err) {
            return done(err, false);
          }
        }
      )
    );
  }

  // GitHub OAuth Strategy
  if (config.oauth.github.clientID && config.oauth.github.clientSecret) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: config.oauth.github.clientID,
          clientSecret: config.oauth.github.clientSecret,
          callbackURL: config.oauth.github.callbackURL,
          scope: ['user:email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user already exists
            let user = await User.findOne({ 'github.id': profile.id });

            if (user) {
              // Update user information if needed
              user.github.token = accessToken;
              user.lastLogin = Date.now();
              await user.save();
              return done(null, user);
            }

            // Get primary email from GitHub
            const primaryEmail = profile.emails.find(email => email.primary) || profile.emails[0];

            // Check if user exists with the same email
            user = await User.findOne({ email: primaryEmail.value });

            if (user) {
              // Link GitHub account to existing user
              user.github = {
                id: profile.id,
                token: accessToken,
              };
              user.lastLogin = Date.now();
              await user.save();
              return done(null, user);
            }

            // Create new user
            const newUser = new User({
              name: profile.displayName || profile.username,
              email: primaryEmail.value,
              avatar: profile.photos[0].value,
              github: {
                id: profile.id,
                token: accessToken,
              },
              isEmailVerified: true, // GitHub already verified the email
              lastLogin: Date.now(),
            });

            await newUser.save();
            return done(null, newUser);
          } catch (err) {
            return done(err, false);
          }
        }
      )
    );
  }

  // Microsoft OAuth Strategy
  if (config.oauth.microsoft.clientID && config.oauth.microsoft.clientSecret) {
    passport.use(
      new MicrosoftStrategy(
        {
          clientID: config.oauth.microsoft.clientID,
          clientSecret: config.oauth.microsoft.clientSecret,
          callbackURL: config.oauth.microsoft.callbackURL,
          scope: ['user.read'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user already exists
            let user = await User.findOne({ 'microsoft.id': profile.id });

            if (user) {
              // Update user information if needed
              user.microsoft.token = accessToken;
              user.lastLogin = Date.now();
              await user.save();
              return done(null, user);
            }

            // Check if user exists with the same email
            const email = profile.emails[0].value;
            user = await User.findOne({ email });

            if (user) {
              // Link Microsoft account to existing user
              user.microsoft = {
                id: profile.id,
                token: accessToken,
              };
              user.lastLogin = Date.now();
              await user.save();
              return done(null, user);
            }

            // Create new user
            const newUser = new User({
              name: profile.displayName,
              email,
              avatar: profile._json.picture,
              microsoft: {
                id: profile.id,
                token: accessToken,
              },
              isEmailVerified: true, // Microsoft already verified the email
              lastLogin: Date.now(),
            });

            await newUser.save();
            return done(null, newUser);
          } catch (err) {
            return done(err, false);
          }
        }
      )
    );
  }
};
