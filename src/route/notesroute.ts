import express from "express";
import singleUpload from "../controllers/multer";
const notesrouter = express.Router();
import {
  createNotesComment,
  getNotesComment,
} from "../controllers/commentcontrller";
import {
  uploadNote,
  getNotes,
  getSingleNote,
  getRating,
  setRating,
  getUserNotes,
  findNote,
} from "../controllers/notescontroller";
notesrouter.route("/notes").post(singleUpload, uploadNote).get(getNotes);
notesrouter.route("/notes/view/:id").get(getSingleNote);
//comment
notesrouter.route("/notes/find/").get(findNote);
notesrouter.route("/notes/:id").post(createNotesComment).get(getNotesComment);
//rate
notesrouter.route("/notes/rate/:id").get(getRating).post(setRating);
notesrouter.route("/notes/user/:id").get(getUserNotes);
export default notesrouter;
