"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newMessageSocket = exports.createMessage = exports.getConversationAndMessages = exports.getConversations = exports.createConversation = void 0;
const conversationmodel_1 = __importDefault(require("../models/conversationmodel"));
const messagemodel_1 = __importDefault(require("../models/messagemodel"));
const newMessageSocket = (messageData, room, sender, receiver) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield messagemodel_1.default.create({
            conversation: room,
            content: messageData,
            sender,
            receiver,
        });
        if (message) {
            const conversation = yield conversationmodel_1.default.findOneAndUpdate({ _id: room }, {
                $push: { messages: message._id },
            });
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.newMessageSocket = newMessageSocket;
const createConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, users } = req.body;
        console.log("name", name, users);
        const newConversation = yield conversationmodel_1.default.create({
            name: name,
            users: users,
        });
        if (!newConversation) {
            return res.status(400).json("cannot create a new conversation");
        }
        return res.status(200).json(newConversation);
    }
    catch (err) {
        console.log(err);
    }
});
exports.createConversation = createConversation;
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield messagemodel_1.default.create({
            conversation: req.body.conversationid,
            content: req.body.content,
            sender: req.body.sender,
            receiver: req.body.receiver,
        });
        if (!message) {
            return res.status(400).json("unable to add message");
        }
        const updated = yield conversationmodel_1.default.findOneAndUpdate({
            _id: req.body.conversationid,
        }, {
            $push: { messages: message._id },
        });
        console.log(updated);
        if (!updated) {
            return res
                .status(400)
                .json("could not update conversation with message id");
        }
        return res.status(200).json("new message created");
    }
    catch (err) {
        console.log(err);
    }
});
exports.createMessage = createMessage;
const getConversationAndMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversationid = req.params.id;
        const page = Number(req.query.page) || 1;
        const skip = 25 * (page - 1);
        const conversation = yield conversationmodel_1.default
            .findOne({ _id: conversationid })
            .populate({
            path: "messages",
            select: "content sender receiver createdAt ",
            options: { limit: 25, skip: skip },
        })
            .populate("users", "-password -followers -following -createdAt -updatedAt");
        if (!conversation) {
            return res.status(400).json("couldnot find convo");
        }
        return res.status(200).json({ conversation });
    }
    catch (err) {
        console.log(err);
    }
});
exports.getConversationAndMessages = getConversationAndMessages;
const getConversations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userid = req.query.userid;
        console.log(userid);
        const conversations = yield conversationmodel_1.default.find({
            users: { $elemMatch: { $eq: userid } },
        });
        if (!conversations) {
            return res.status(400).json("cannot find conversations");
        }
        return res.status(200).json(conversations);
    }
    catch (err) {
        console.log(err);
    }
});
exports.getConversations = getConversations;
