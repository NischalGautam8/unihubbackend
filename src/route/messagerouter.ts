import {
  createConversation,
  getConversationAndMessages,
  getConversations,
  createMessage,
} from "../controllers/messagecontroller";
import canViewMessage from "../auth/canViewMessage";
import express from "express";
const messagerouter = express();
//get conversations a user is involved in with userid
messagerouter
  .route("/conversation")
  .get(getConversations)
  .post(createConversation);
//get a single conversation info and it's last 25 messages based on coversation id
messagerouter
  .route("/convoandmessage/:id")
  .get(canViewMessage, getConversationAndMessages);
messagerouter.route("/messeges").post(createMessage);
export default messagerouter;
