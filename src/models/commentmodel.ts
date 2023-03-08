import mongoose from "mongoose";
const Comment = new mongoose.Schema(
  {
    content: String,
    likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    username: String,
    commentimage: String,

    firstName: String,
    lastName: String,
    postid: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
    replies: [{ type: mongoose.Types.ObjectId, ref: "comment" }],
  },
  { timestamps: true }
);
const comment = mongoose.model("Comment", Comment);
export default comment;
