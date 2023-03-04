"use strict";
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20");
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSercet: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"],
}, function (acessToken, refreshToken, profile, callback) {
    //this is where you want to store data to db
    console.log(profile);
    console.log(acessToken);
    callback(null, profile);
}));
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});
