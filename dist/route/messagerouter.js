"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messagecontroller_1 = require("../controllers/messagecontroller");
const canViewMessage_1 = __importDefault(require("../auth/canViewMessage"));
const express_1 = __importDefault(require("express"));
const messagerouter = (0, express_1.default)();
//get conversations a user is involved in with userid
messagerouter
    .route("/conversation")
    .get(messagecontroller_1.getConversations)
    .post(messagecontroller_1.createConversation);
//get a single conversation info and it's last 25 messages based on coversation id
messagerouter
    .route("/convoandmessage/:id")
    .get(canViewMessage_1.default, messagecontroller_1.getConversationAndMessages);
messagerouter.route("/messeges").post(messagecontroller_1.createMessage);
exports.default = messagerouter;
