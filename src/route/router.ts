import express from "express";
const routing = express.Router();
import {
  createPost,
  likepost,
  unlikepost,
  getHomePosts,
  getonepost,
} from "../controllers/postcontroller";
import { createcomment, getcomments } from "../controllers/commentcontrller";
import {
  login,
  register,
  generatenewacesstoken,
} from "../controllers/usercontroller";
routing.route("/posts").post(createPost).get(getHomePosts);
routing.route("/posts/like/:id").post(likepost).get(getonepost);
routing.route("/posts/unlike/:id").post(unlikepost);
routing.route("/register").post(register);
routing.route("/login").post(login);
routing.route("/comment/:id").get(getcomments);
routing.route("/comment").post(createcomment);
routing.route("/generate").post(generatenewacesstoken);
// routing.get("/protected", (req, res) => {
//   res.send("hello" + req.user);
// });
export default routing;
