import express from "express";
const routing = express.Router();
import {
  createPost,
  likepost,
  getHomePosts,
  getonepost,
} from "../controllers/postcontroller";
import { createcomment, getcomments } from "../controllers/commentcontrller";
import { login, register } from "../controllers/usercontroller";
routing.route("/posts").post(createPost).get(getHomePosts);
routing.route("/posts/:id").post(likepost).get(getonepost);
routing.route("/register").post(register);
routing.route("/login").post(login);
routing.route("/comment/:id").get(getcomments);
routing.route("/comment").post(createcomment);
export default routing;
