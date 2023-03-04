"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
var GoogleStrategy = require("passport-google-oauth20");
const cookie_session_1 = __importDefault(require("cookie-session"));
const app = (0, express_1.default)();
app.use((0, cookie_session_1.default)({
    name: "session",
    keys: ["cyberwolve"],
    maxAge: 24 * 60 * 60 * 100,
}));
app.listen(5000, () => {
    console.log("listening to port ");
});
passport_1.default.use(new GoogleStrategy({
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
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
