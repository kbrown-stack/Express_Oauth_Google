const passport = require('passport');
require("dotenv").config() // This helps to access enviroment variables 
const GoogleStrategy = require('passport-google-oauth2').Strategy;
passport.serializeUser(function(user, done) {
    done(null, user);

});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// This below is the Middle ware that does the Oauth flow for Google

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
    passReqToCallback : true
},
function(request,accessToken, refreshToken, profile, done) {
    return done(null, profile)
}
));
