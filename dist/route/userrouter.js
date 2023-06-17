"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userrouter = express_1.default.Router();
const multer_1 = __importDefault(require("../controllers/multer"));
const usercontroller_1 = require("../controllers/usercontroller");
userrouter.route("/users/find/").get(usercontroller_1.findUser);
userrouter.route("/following/:id").get(usercontroller_1.getFollwing);
userrouter.route("/generate").post(usercontroller_1.generatenewacesstoken);
userrouter.route("/register").post(usercontroller_1.register);
userrouter.route("/login").post(usercontroller_1.login);
///USER PROFILE
userrouter.route("/user/:userid").get(usercontroller_1.getUserInfo);
userrouter.route("/follow/:id").post(usercontroller_1.follow);
userrouter.route("/unfollow/:id").post(usercontroller_1.unfollow);
userrouter.route("/uploadprofilepic").post(multer_1.default, usercontroller_1.uploadProfilePic);
userrouter.route("/followers/:id").get(usercontroller_1.getFollowers);
userrouter.route("/follwing/:id").get(usercontroller_1.getFollwing);
exports.default = userrouter;
