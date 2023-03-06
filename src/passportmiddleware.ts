import passport from "passport";
import passportGoogleOauth20 from "passport-google-oauth20";

const GoogleStrategy = passportGoogleOauth20.Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "830386723810-nk79gggacb4c7tr7d66nbqoqqrf4h6v1.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:5000/auth/callback",
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, done) {
      // This function will be called when the user has been authenticated by Google
      // You can use this function to save the user data to your database or perform other operations

      try {
        // Save user data to database
        // const user = await userModel.findOneAndUpdate(
        //   { email: profile.emails[0].value },
        //   { name: profile.displayName },
        //   { upsert: true, new: true }
        // );
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
export default GoogleStrategy;
