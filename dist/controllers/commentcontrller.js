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
exports.getNotesComment = exports.createNotesComment = exports.getReply = exports.createReply = exports.getcomments = exports.createcomment = void 0;
const postmodel_1 = __importDefault(require("../models/postmodel"));
const commentmodel_1 = __importDefault(require("../models/commentmodel"));
const commentmodel_2 = __importDefault(require("../models/commentmodel"));
const notesmodel_1 = __importDefault(require("../models/notesmodel"));
const createcomment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postid = req.params.id;
        const { content, userid } = req.body;
        const post = postmodel_1.default.findOne({ _id: postid });
        console.log(typeof userid, typeof postid);
        if (!post) {
            return res.status(400).json({ msg: "no such post exists" });
        }
        else {
            const comment = yield commentmodel_1.default.create({
                content: content,
                user: userid,
                postid: postid,
            });
            if (!comment) {
                res.status(400).json({ msg: "unable to create a comment" });
            }
            else {
                yield post.findOneAndUpdate({ _id: postid }, {
                    $push: { comments: comment._id },
                }, { new: true });
                res.status(200).json("comment added sucessfully");
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err });
    }
});
exports.createcomment = createcomment;
//////Notes///////
const createNotesComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const noteid = req.params.id;
        const { content, userid } = req.body;
        const note = notesmodel_1.default.findOne({ _id: noteid });
        console.log(typeof userid, typeof noteid);
        if (!note) {
            return res.status(400).json({ msg: "no such note exists" });
        }
        else {
            console.log(userid);
            const comment = yield commentmodel_1.default.create({
                content: content,
                user: userid,
                postid: noteid,
            });
            if (!comment) {
                res.status(400).json({ msg: "unable to create a comment" });
            }
            else {
                yield notesmodel_1.default.findOneAndUpdate({ _id: noteid }, {
                    $push: { comments: comment._id },
                }, { new: true });
                res.status(200).json("comment added sucessfully");
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err });
    }
});
exports.createNotesComment = createNotesComment;
const getNotesComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield notesmodel_1.default.findOne({ _id: req.params.id }).populate({
            path: "comments",
            populate: {
                path: "user",
                select: "_id username lastName firstName",
            },
        });
        if (note) {
            return res.status(200).json({ msg: note.comments });
        }
        return res.status(400).json("note not found");
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});
exports.getNotesComment = getNotesComment;
const getcomments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postcomments = yield postmodel_1.default.findOne({ _id: req.params.id }).populate({
            path: "comments",
            populate: {
                path: "user",
                select: "_id username lastName firstName",
            },
        });
        if (postcomments) {
            return res.status(200).json({ msg: postcomments.comments });
        }
        return res.status(400).json("post/comment not found");
    }
    catch (err) {
        console.log(err);
    }
});
exports.getcomments = getcomments;
const createReply = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newreply = yield commentmodel_1.default.create({
            content: req.body.content,
            user: req.body.userid,
            postid: req.params.id, //this time the post will be another comment so provide comment id
        });
        if (!newreply) {
            return res.status(500).json("unable to create a new comment");
        }
        const reply = yield commentmodel_1.default.findOneAndUpdate({ _id: req.params.id }, //id for comment to which we want to reply
        {
            $push: { replies: newreply._id },
        });
        if (!reply) {
            return res.status(500).json("unable to create a reply");
        }
        res.status(200).json("reply added to the comment");
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: err });
    }
});
exports.createReply = createReply;
const getReply = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const replies = yield commentmodel_2.default.findOne({ _id: req.params.id }).populate({
            path: "replies",
            populate: {
                path: "user",
                select: "_id username lastName firstName",
            },
        });
        if (replies) {
            return res.status(200).json({ msg: replies.replies });
        }
        return res.status(400).json("post/comment not found");
    }
    catch (err) {
        console.log(err);
    }
});
exports.getReply = getReply;
