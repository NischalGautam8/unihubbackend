"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("../controllers/multer"));
const notesrouter = express_1.default.Router();
const commentcontrller_1 = require("../controllers/commentcontrller");
const notescontroller_1 = require("../controllers/notescontroller");
notesrouter.route("/notes").post(multer_1.default, notescontroller_1.uploadNote).get(notescontroller_1.getNotes);
notesrouter.route("/notes/view/:id").get(notescontroller_1.getSingleNote);
//comment
notesrouter.route("/notes/find/").get(notescontroller_1.findNote);
notesrouter.route("/notes/:id").post(commentcontrller_1.createNotesComment).get(commentcontrller_1.getNotesComment);
//rate
notesrouter.route("/notes/rate/:id").get(notescontroller_1.getRating).post(notescontroller_1.setRating);
notesrouter.route("/notes/user/:id").get(notescontroller_1.getUserNotes);
exports.default = notesrouter;
