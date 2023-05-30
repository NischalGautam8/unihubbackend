import mongoose from "mongoose";
const meesagemodel = new mongoose.Schema(
  {
    conversation: { type: mongoose.Types.ObjectId, ref: "conversation" },
    content: String,
    sender: { type: mongoose.Types.ObjectId, ref: "user" },
    receiver: { type: mongoose.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);
const messageModel = mongoose.model("messages", meesagemodel);
export default messageModel;
