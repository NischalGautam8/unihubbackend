import express from "express";
import {
  createcomment,
  createReply,
  getReply,
  getcomments,
  createNotesComment,
  getNotesComment,
} from "../controllers/commentcontrller";
const commentsroute = express();
commentsroute.route("/comment/:id").get(getcomments);
commentsroute.route("/comment/:id").post(createcomment);
commentsroute.route("/reply/:id").post(createReply);
commentsroute.route("/reply/:id").get(getReply);
export default commentsroute;
