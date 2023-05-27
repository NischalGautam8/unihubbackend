"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Post = new mongoose_1.default.Schema({
    description: {
        type: String,
        required: [true, "description is must"],
    },
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: [true, "userid is required"],
    },
    likes: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose_1.default.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true });
const Postexport = mongoose_1.default.model("Post", Post);
exports.default = Postexport;
