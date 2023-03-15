import express from "express";
const routing = express.Router();
import {
  createPost,
  likepost,
  unlikepost,
  getHomePosts,
  getonepost,
} from "../controllers/postcontroller";
import {
  createConversation,
  getConversationAndMessages,
  getConversations,
  createMessage,
} from "../controllers/messagecontroller";
import {
  createcomment,
  createReply,
  getReply,
  getcomments,
} from "../controllers/commentcontrller";
import {
  login,
  register,
  generatenewacesstoken,
} from "../controllers/usercontroller";
routing.route("/posts").post(createPost).get(getHomePosts);
routing.route("/posts/:id").get(getonepost);
routing.route("/posts/like/:id").post(likepost);
routing.route("/posts/unlike/:id").post(unlikepost);
routing.route("/register").post(register);
routing.route("/login").post(login);
routing.route("/conversation").get(getConversations).post(createConversation);
routing.route("/convoandmessage").post(getConversationAndMessages);
routing.route("/messeges").post(createMessage);
routing.route("/comment/:id").get(getcomments);
routing.route("/comment/:id").post(createcomment);
routing.route("/reply/:id").post(createReply);
routing.route("/reply/:id").get(getReply);
routing.route("/generate").post(generatenewacesstoken);
// routing.get("/protected", (req, res) => {
//   res.send("hello" + req.user);
// });
export default routing;
