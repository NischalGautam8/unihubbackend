"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Comment = new mongoose_1.default.Schema({
    content: String,
    likes: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }],
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
    },
    commentimage: String,
    postid: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Post",
    },
    replies: [{ type: mongoose_1.default.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true });
const comment = mongoose_1.default.model("Comment", Comment);
exports.default = comment;
