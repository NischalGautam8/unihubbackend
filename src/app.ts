import express from "express";
const app = express();

import mongoose from "mongoose";
import routing from "./route/router";
import bodyParser from "body-parser";
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
app.use(cors());
app.use(
  require("express-session")({
    secret: "your secret",
    resave: true,
    saveUninitialized: true,
  })
);
mongoose.set("strictQuery", false);

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
app.use("/api", routing);
