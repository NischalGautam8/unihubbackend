"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const meesagemodel = new mongoose_1.default.Schema({
    conversation: { type: mongoose_1.default.Types.ObjectId, ref: "conversation" },
    content: String,
    sender: { type: mongoose_1.default.Types.ObjectId, ref: "user" },
    receiver: { type: mongoose_1.default.Types.ObjectId, ref: "user" },
});
const messageModel = mongoose_1.default.model("messages", meesagemodel);
exports.default = messageModel;
