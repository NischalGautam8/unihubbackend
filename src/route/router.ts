import express from "express";
const routing = express.Router();
import { uploadNote } from "../controllers/notescontroller";
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
  getFollwing,
  follow,
  uploadProfilePic,
} from "../controllers/usercontroller";
import { singleUpload } from "../controllers/multer";
routing.route("/posts").post(createPost).get(getHomePosts);
routing.route("/posts/:id").get(getonepost);
routing.route("/posts/like/:id").post(likepost);
routing.route("/posts/unlike/:id").post(unlikepost);
routing.route("/register").post(register);
routing.route("/login").post(login);
routing.route("/follow/:id").post(follow);
routing.route("/uploadprofilepic").post(singleUpload, uploadProfilePic);
//get following of a user
//NOTES////
routing.route("/uploadnote").post(singleUpload, uploadNote);
routing.route("/following/:id").get(getFollwing);
//get conversations a user is involved in with userid

routing.route("/conversation").get(getConversations).post(createConversation);
//get a single conversation and it's last 25 messages based on coversation id
routing.route("/convoandmessage/:id").get(getConversationAndMessages);
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
