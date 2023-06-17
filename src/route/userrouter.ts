import express from "express";
const userrouter = express.Router();
import { verifyToken } from "../auth/verifyToken";
import singleUpload from "../controllers/multer";
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
userrouter.route("/users/find/").get(findUser);
userrouter.route("/following/:id").get(getFollwing);
userrouter.route("/generate").post(generatenewacesstoken);
userrouter.route("/register").post(register);
userrouter.route("/login").post(login);
///USER PROFILE
userrouter.route("/user/:userid").get(getUserInfo);
userrouter.route("/follow/:id").post(follow);
userrouter.route("/unfollow/:id").post(unfollow);
userrouter.route("/uploadprofilepic").post(singleUpload, uploadProfilePic);
userrouter.route("/followers/:id").get(getFollowers);
userrouter.route("/follwing/:id").get(getFollwing);
export default userrouter;
