import express from "express";
const routing = express.Router();
import { verifyToken } from "../auth/verifyToken";
import {
  uploadNote,
  getNotes,
  getSingleNote,
  getRating,
  setRating,
  getUserNotes,
  findNote,
} from "../controllers/notescontroller";
import {
  createPost,
  likepost,
  unlikepost,
  getHomePosts,
  getonepost,
  getUserPosts,
  savePost,
  unsavePost,
  getSavedPosts,
  findPost,
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
  createNotesComment,
  getNotesComment,
} from "../controllers/commentcontrller";
import {
  login,
  register,
  generatenewacesstoken,
  getFollwing,
  follow,
  unfollow,
  uploadProfilePic,
  getUserInfo,
  getFollowers,
  findUser,
} from "../controllers/usercontroller";
import { singleUpload } from "../controllers/multer";
import verifyOwner from "../auth/verifyOwner";
import canViewMessage from "../auth/canViewMessage";
routing.route("/posts").post(singleUpload, createPost).get(getHomePosts);
routing.route("/posts/:id").get(getonepost);
routing.route("/posts/user/:id").get(getUserPosts);
routing.route("/posts/like/:id").post(verifyToken, likepost);
routing.route("/posts/unlike/:id").post(verifyToken, unlikepost);
routing.route("/posts/save/:id").post(savePost);
routing.route("/posts/unsave/:id").post(unsavePost);
routing.route("/posts/saved/:id").get(getSavedPosts);
routing.route("/posts/find").get(findPost);
routing.route("/notes/find").get(findNote);
routing.route("/users/find/").get(findUser);

//NOTES////
//jwt validation is not working
routing.route("/notes").post(singleUpload, uploadNote).get(getNotes);
routing.route("/notes/view/:id").get(getSingleNote);
//comment
routing.route("/notes/:id").post(createNotesComment).get(getNotesComment);
//rate
routing.route("/notes/rate/:id").get(getRating).post(setRating);
routing.route("/notes/user/:id").get(getUserNotes);

////Follow
routing.route("/following/:id").get(getFollwing);

//get conversations a user is involved in with userid
routing.route("/conversation").get(getConversations).post(createConversation);
//get a single conversation info and it's last 25 messages based on coversation id
routing
  .route("/convoandmessage/:id")
  .get(canViewMessage, getConversationAndMessages);
routing.route("/messeges").post(createMessage);
//POSTS COMMENTING
routing.route("/comment/:id").get(getcomments);
routing.route("/comment/:id").post(createcomment);
routing.route("/reply/:id").post(createReply);
routing.route("/reply/:id").get(getReply);
//AUTHENTICATION
routing.route("/generate").post(generatenewacesstoken);
routing.route("/register").post(register);
routing.route("/login").post(login);
///USER PROFILE
routing.route("/user/:userid").get(getUserInfo);
routing.route("/follow/:id").post(follow);
routing.route("/unfollow/:id").post(unfollow);
routing.route("/uploadprofilepic").post(singleUpload, uploadProfilePic);
routing.route("/followers/:id").get(getFollowers);
routing.route("/follwing/:id").get(getFollwing);
export default routing;
