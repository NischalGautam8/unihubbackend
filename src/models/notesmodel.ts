import mongoose, { Mongoose } from "mongoose";
const note = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  rating: {
    type: Number,
  },
  size: {
    type: Number,
  },
  comments: {
    type: mongoose.Types.ObjectId,
    ref: "comment",
  },
});
const notesModel = mongoose.model("Notes", note);
export default notesModel;
