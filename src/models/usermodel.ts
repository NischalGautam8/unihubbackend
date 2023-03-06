import mongoose from "mongoose";
const User = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    googleId: String,
    password: {
      type: String,
    },
    firstName: {
      type: String,
    },
    email: {
      type: String,
    },
    lastName: {
      type: String,
    },
    gender: {
      type: String,
      default: "Male",
    },
    followers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
const usermodel = mongoose.model("User", User);
export default usermodel;
