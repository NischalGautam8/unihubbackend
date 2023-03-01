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
exports.likepost = exports.createPost = void 0;
const postmodel_1 = __importDefault(require("../models/postmodel"));
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const body = req.body;
        console.log(body ? "yes" : "no");
        const result = yield postmodel_1.default.create({
            description: body.description,
            firstName: body.firstName,
            lastName: body.lastName,
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
const likepost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userid = req.body.userid;
        console.log(typeof userid);
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
