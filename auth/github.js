const passport = require('passport');
require("dotenv").config() // This helps to access enviroment variables 
const GitHubStrategy = require('passport-github2').Strategy;
passport.serializeUser(function(user, done) {
    done(null, user);

});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// This below is the Middle ware that does the Oauth flow for Github

passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL, // Must match GitHub settings
      },
      function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
      }
    )
  );