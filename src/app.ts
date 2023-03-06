import express from "express";
const app = express();
import mongoose from "mongoose";
import session from "express-session";
import routing from "./route/router";
import passport from "passport";
import bodyParser from "body-parser";
import GoogleStrategy from "./passportmiddleware";
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
app.use(cors());
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
mongoose.set("strictQuery", false);
app.use("/api", routing);
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  function (req, res) {
    res.redirect("/");
  }
);
const start = () => {
  try {
    mongoose
      .connect(
        "mongodb+srv://nischalgautam7200:720058726Nn1@cluster0.4qkuktl.mongodb.net/?retryWrites=true&w=majority"
      )
      .then(() =>
        app.listen(5000, () =>
          console.log("connected to the database & listening to port")
        )
      );
  } catch (err) {
    console.log(err);
  }
};
start();
