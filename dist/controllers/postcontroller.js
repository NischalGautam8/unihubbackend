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
exports.unlikepost = exports.getonepost = exports.getHomePosts = exports.likepost = exports.createPost = void 0;
const postmodel_1 = __importDefault(require("../models/postmodel"));
const getonepost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(id);
        const result = yield postmodel_1.default.findOne({ _id: id });
        if (!result) {
            return res.status(404).json("cannot find the post");
        }
        else {
            res.status(200).json(result);
        }
    }
    catch (err) {
        res.status(400).json(err);
        console.log(err);
    }
});
exports.getonepost = getonepost;
const getHomePosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.params.page) || 1;
    const posts = postmodel_1.default.find();
    if (!posts) {
        return res.status(400).json({ err: "unable to retrive posts" });
    }
    else {
        const limit = 20;
        const skip = (page - 1) * limit;
        const postb = posts.skip(skip);
        const posta = postb.limit(limit);
        const toreturn = yield posta;
        res.status(200).json({ msg: toreturn });
    }
});
exports.getHomePosts = getHomePosts;
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const body = req.body;
        console.log(body ? "yes" : "no");
        const result = yield postmodel_1.default.create({
            description: body.description,
            firstName: body.firstName,
            lastName: body.lastName,
            username: body.username,
            userId: body.userId,
        });
        if (result) {
            res.status(200).json("Posted sucessfully");
        }
        else {
            res.status(500).json({ msg: "unable to create a new post" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});
exports.createPost = createPost;
const unlikepost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postid = req.params.id;
        const userid = req.body.userid;
        if (!userid) {
            return res.status(400).json("userid must be provided");
        }
        const post = yield postmodel_1.default.findOneAndUpdate({ _id: req.params.id, likes: userid }, {
            $pull: { likes: userid },
        }, { new: true });
        if (!post) {
            return res
                .status(500)
                .json("unable to find or unlike post as you have not liked it ");
        }
        else {
            res.status(200).json("unliked the post");
        }
    }
    catch (err) {
        res.status(500).json({ err: err });
    }
});
exports.unlikepost = unlikepost;
const likepost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userid = req.body.userid;
        console.log(typeof userid);
        if (!userid) {
            return res.status(500).json("userid must be sent");
        }
        const { id } = req.params;
        const post = yield postmodel_1.default.findOne({
            _id: id,
            likes: userid,
        }, { new: true });
        if (post) {
            return res.status(500).json("you have already liked this post");
        }
        else {
            const posttolike = yield postmodel_1.default.findOneAndUpdate({ _id: id }, {
                $push: { likes: userid },
            }, { new: true });
            if (!posttolike) {
                res.status(500).json({ err: "unable to like the post" });
            }
            else {
                res.status(200).json("liked the post");
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.likepost = likepost;
