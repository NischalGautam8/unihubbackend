import mongoose from "mongoose";
const conversation = new mongoose.Schema(
  {
    name: String,
    users: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    messages: [{ type: mongoose.Types.ObjectId, ref: "messages" }],
  },
  { timestamps: true }
);
const conversationmodel = mongoose.model("Conversation", conversation);
export default conversationmodel;
