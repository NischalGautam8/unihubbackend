import mongoose from "mongoose";
const Comment = new mongoose.Schema(
  {
    content: String,
    likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    postid: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);
const comment = mongoose.model("Comment", Comment);
export default comment;
