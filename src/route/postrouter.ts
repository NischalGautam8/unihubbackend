import express from "express";
import singleUpload from "../controllers/multer";
import { verifyToken } from "../auth/verifyToken";
const postrouter = express();
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

postrouter.route("/posts").post(singleUpload, createPost).get(getHomePosts);
postrouter.route("/posts/find/").get(findPost);
postrouter.route("/posts/:id").get(getonepost);
postrouter.route("/posts/user/:id").get(getUserPosts);
postrouter.route("/posts/like/:id").post(verifyToken, likepost);
postrouter.route("/posts/unlike/:id").post(verifyToken, unlikepost);
postrouter.route("/posts/save/:id").post(savePost);
postrouter.route("/posts/unsave/:id").post(unsavePost);
postrouter.route("/posts/saved/:id").get(getSavedPosts);
export default postrouter;
