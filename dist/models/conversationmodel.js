"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const conversation = new mongoose_1.default.Schema({
    name: String,
    users: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }],
    messages: [{ type: mongoose_1.default.Types.ObjectId, ref: "messages" }],
}, { timestamps: true });
const conversationmodel = mongoose_1.default.model("Conversation", conversation);
exports.default = conversationmodel;
