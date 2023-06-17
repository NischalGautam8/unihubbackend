"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentcontrller_1 = require("../controllers/commentcontrller");
const commentsroute = (0, express_1.default)();
commentsroute.route("/comment/:id").get(commentcontrller_1.getcomments);
commentsroute.route("/comment/:id").post(commentcontrller_1.createcomment);
commentsroute.route("/reply/:id").post(commentcontrller_1.createReply);
commentsroute.route("/reply/:id").get(commentcontrller_1.getReply);
exports.default = commentsroute;
