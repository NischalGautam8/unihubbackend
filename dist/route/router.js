"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routing = express_1.default.Router();
const verifyToken_1 = require("../auth/verifyToken");
const notescontroller_1 = require("../controllers/notescontroller");
const postcontroller_1 = require("../controllers/postcontroller");
const messagecontroller_1 = require("../controllers/messagecontroller");
const commentcontrller_1 = require("../controllers/commentcontrller");
const usercontroller_1 = require("../controllers/usercontroller");
const multer_1 = require("../controllers/multer");
routing.route("/posts").post(verifyToken_1.verifyToken, postcontroller_1.createPost).get(postcontroller_1.getHomePosts);
routing.route("/posts/:id").get(postcontroller_1.getonepost);
routing.route("/posts/like/:id").post(verifyToken_1.verifyToken, postcontroller_1.likepost);
routing.route("/posts/unlike/:id").post(verifyToken_1.verifyToken, postcontroller_1.unlikepost);
routing.route("/follow/:id").post(usercontroller_1.follow);
routing.route("/uploadprofilepic").post(multer_1.singleUpload, usercontroller_1.uploadProfilePic);
//get following of a user
//NOTES////
routing.route("/notes").post(multer_1.singleUpload, notescontroller_1.uploadNote).get(notescontroller_1.getNotes);
routing.route("/notes/view/:id").get(notescontroller_1.getSingleNote);
//comment
routing.route("/notes/:id").post(commentcontrller_1.createNotesComment).get(commentcontrller_1.getNotesComment);
//rate
routing.route("/notes/rate/:id").get(notescontroller_1.getRating).post(notescontroller_1.setRating);
////Follow
routing.route("/following/:id").get(usercontroller_1.getFollwing);
//get conversations a user is involved in with userid
routing.route("/conversation").get(messagecontroller_1.getConversations).post(messagecontroller_1.createConversation);
//get a single conversation info and it's last 25 messages based on coversation id
routing.route("/convoandmessage/:id").get(messagecontroller_1.getConversationAndMessages);
routing.route("/messeges").post(messagecontroller_1.createMessage);
//POSTS COMMENTING
routing.route("/comment/:id").get(commentcontrller_1.getcomments);
routing.route("/comment/:id").post(commentcontrller_1.createcomment);
routing.route("/reply/:id").post(commentcontrller_1.createReply);
routing.route("/reply/:id").get(commentcontrller_1.getReply);
//AUTHENTICATION
routing.route("/generate").post(usercontroller_1.generatenewacesstoken);
routing.route("/register").post(usercontroller_1.register);
routing.route("/login").post(usercontroller_1.login);
// routing.get("/protected", (req, res) => {
//   res.send("hello" + req.user);
// });
exports.default = routing;
