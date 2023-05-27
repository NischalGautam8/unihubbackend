import mongoose, { Mongoose } from "mongoose";
const note = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    uploadedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    ratingsMap: {
      type: Map,
      of: String,
    },
    size: {
      type: Number,
    },
    subject: {
      type: String,
    },
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);
const notesModel = mongoose.model("Notes", note);
export default notesModel;
