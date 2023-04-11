"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const note = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    uploadedBy: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "user",
        required: true,
    },
    rating: {
        type: Number,
    },
    size: {
        type: Number,
    },
    comments: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "comment",
    },
});
const notesModel = mongoose_1.default.model("Notes", note);
exports.default = notesModel;
