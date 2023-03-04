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
exports.getcomments = exports.createcomment = void 0;
const postmodel_1 = __importDefault(require("../models/postmodel"));
const commentmodel_1 = __importDefault(require("../models/commentmodel"));
const createcomment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, userid, postid } = req.body;
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
const getcomments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postid = req.params.id;
        console.log(postid);
        const post = yield postmodel_1.default.findOne({ _id: postid });
        if (!post) {
            return res.status(400).json("unable to find post");
        }
        else {
            const commentidarr = post.comments;
            const newarr = [];
            yield Promise.all(commentidarr.map((element) => __awaiter(void 0, void 0, void 0, function* () {
                const commentofpost = yield commentmodel_1.default.findOne({
                    _id: element,
                });
                newarr.push(commentofpost);
                // console.log(commentofpost);
            })));
            console.log(newarr);
            res.status(200).json({ msg: newarr });
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.getcomments = getcomments;
