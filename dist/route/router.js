"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routing = express_1.default.Router();
const postcontroller_1 = require("../controllers/postcontroller");
const commentcontrller_1 = require("../controllers/commentcontrller");
const usercontroller_1 = require("../controllers/usercontroller");
routing.route("/posts").post(postcontroller_1.createPost);
routing.route("/posts/:id").post(postcontroller_1.likepost);
routing.route("/register").post(usercontroller_1.register);
routing.route("/login").post(usercontroller_1.login);
routing.route("/comment").post(commentcontrller_1.createcomment).get(commentcontrller_1.getcomments);
exports.default = routing;
