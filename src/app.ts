import express from "express";
const app = express();
import mongoose from "mongoose";
import session from "express-session";
import routing from "./route/router";
import passport from "passport";
import bodyParser from "body-parser";
import GoogleStrategy from "./passportmiddleware";
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
const io = new Server(httpserver, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("joined room ", data);
  });
  socket.on("send_message", (data) => {
    console.log(data);
    socket.emit("receive_message", data);
  });
});
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
        httpserver.listen(5000, () =>
          console.log("connected to the database & listening to port")
        )
      );
  } catch (err) {
    console.log(err);
  }
};
start();
