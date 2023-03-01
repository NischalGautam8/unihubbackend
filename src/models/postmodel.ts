import mongoose from "mongoose";
const Post = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "description is must"],
    },
    userId: {
      type: String,
      required: [true, "userid is required"],
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);
const Postexport = mongoose.model("Post", Post);
export default Postexport;
