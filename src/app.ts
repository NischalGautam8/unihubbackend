import express from "express";
const app = express();
import mongoose from "mongoose";
import session from "express-session";
import routing from "./route/router";
import passport from "passport";
require("dotenv").config();
import bodyParser from "body-parser";
import cloudinary from "cloudinary";
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
app.use(cors());
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
mongoose.set("strictQuery", false);
import http from "http";
const httpserver = http.createServer(app);
import { Server } from "socket.io";
import { newMessageSocket } from "./controllers/messagecontroller";
import userrouter from "./route/userrouter";
import commentsroute from "./route/commentsrouter";
import notesrouter from "./route/notesroute";
import messagerouter from "./route/messagerouter";
import postrouter from "./route/postrouter";
//cloudinary setup
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const io = new Server(httpserver, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001","https://unihubfrontend-1fhxgei0a-headshigh.vercel.app","https://www.unihubfrontend.vercel.app"],
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  socket.on("join_room", (data, jwt) => {
    socket.join(data);
    console.log("jwt", jwt);
    ///TODO:JWT authenticate on room join
    console.log("joined room ", data);
  });
  socket.on("send_message", (data) => {
    console.log(data);
    newMessageSocket(data.message, data.room, data.sender, data.receiver); //to insert the message to the db
    socket.broadcast.emit("receive_message", data);
  });
});
// app.use("/api", routing);
app.use("/api", commentsroute);
app.use("/api", notesrouter);
app.use("/api", messagerouter);
app.use("/api", userrouter);
app.use("/api", postrouter);
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
      .connect("mongodb+srv://nischalgautam7200:720058726Nn1@cluster0.4qkuktl.mongodb.net/?retryWrites=true&w=majority")
      .then(() =>
        httpserver.listen(process.env.PORT, () =>
          console.log("connected to the database & listening to port")
        )
      );
  } catch (err) {
    console.log(err);
  }
};
start();
