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
exports.findUser = exports.getUserInfo = exports.unfollow = exports.follow = exports.getFollowers = exports.getFollwing = exports.uploadProfilePic = exports.generatenewacesstoken = exports.login = exports.register = void 0;
const usermodel_1 = __importDefault(require("../models/usermodel"));
const refreshtoken_1 = __importDefault(require("../models/refreshtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dataUri_1 = __importDefault(require("../utils/dataUri"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const mongoose_1 = __importDefault(require("mongoose"));
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield usermodel_1.default
            .findOne({ _id: req.params.userid })
            .select("firstName lastName username profilepic gender createdAt followers following");
        if (!user) {
            return res.status(404).json({ err: "User does not exist" });
        }
        console.log("Requesting", req.query.myid);
        // Convert req.query.myid to ObjectId for proper comparison
        const myId = req.query.myid;
        const myObjectId = mongoose_1.default.Types.ObjectId.isValid(myId)
            ? new mongoose_1.default.Types.ObjectId(myId)
            : null;
        const toreturn = {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            createdAt: user.createdAt,
            profilepic: user.profilepic,
            gender: user.gender,
            followerCount: user.followers.length,
            followingCount: user.following.length,
            doYouFollow: myObjectId
                ? user.followers.some((followerId) => followerId.equals(myObjectId))
                : false, // Ensure proper ObjectId comparison
        };
        return res.status(200).json({ user: toreturn });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ error: "An error occurred" });
    }
});
exports.getUserInfo = getUserInfo;
const getFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = req.query.page || 1;
        const skip = (Number(page) - 1) * 30;
        //@ts-expect-error
        const user = yield usermodel_1.default
            .findOne({ _id: req.params.id })
            .populate("followers", "-password   -email  -createdAt -updatedAt")
            .skip(skip);
        if (!user) {
            return res.status(404).send("no user found");
        }
        else {
            console.log(user);
            //@ts-expect-error
            const toreturn = user.followers.map((follower) => {
                const obj = {
                    _id: follower._id,
                    firstName: follower.firstName,
                    lastName: follower.lastName,
                    //@ts-expect-error
                    doYouFollow: follower.followers.includes(req.query.id),
                };
                return obj;
            });
            console.log(toreturn);
            return res.status(200).json({
                followers: toreturn,
            });
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.getFollowers = getFollowers;
const getFollwing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = req.query.page || 1;
        const skip = (Number(page) - 1) * 30;
        //@ts-expect-error
        const user = yield usermodel_1.default
            .findOne({ _id: req.params.id })
            .populate("following", "-password -email  -createdAt -updatedAt")
            .skip(skip);
        if (!user) {
            return res.status(404).json("cannot get following");
        }
        //@ts-expect-error
        const toreturn = user.following.map((follower) => {
            const obj = {
                _id: follower._id,
                firstName: follower.firstName,
                lastName: follower.lastName,
                //@ts-expect-error
                doYouFollow: follower.followers.includes(req.query.id),
                //@ts-expect-error
                isFriend: follower.following.includes(req.params.id),
            };
            return obj;
        });
        return res.status(200).json({ following: toreturn });
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});
exports.getFollwing = getFollwing;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.password.length < 6) {
            return res
                .status(400)
                .json({ msg: "password must be at least 6 characters" });
        }
        if (!req.body.username) {
            return res.status(400).json("username is required");
        }
        if (!req.body.firstName) {
            return res.status(400).json("firstName is required");
        }
        if (!req.body.lastName) {
            return res.status(400).json("lastName is required");
        }
        const usernametaken = yield usermodel_1.default.findOne({
            username: req.body.username,
        });
        if (usernametaken)
            return res.status(400).json({ err: "username is already taken" });
        //@ts-expect-error
        const user = yield usermodel_1.default.create({
            username: req.body.username,
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            email: req.body.email,
            gender: req.body.gender,
            password: yield bcrypt_1.default.hash(req.body.password, 10),
        });
        if (!user) {
            res.status(400).json("unable to create user");
        }
        else {
            console.log("user", user);
            const toreturn = {
                _id: user._id,
                username: user.username,
                lastName: user.lastName,
                firstName: user.firstName,
            };
            // console.log("toreturn",toreturn);
            const acess_token = createAcessToken({ id: user._id });
            const refresh_token = createRefreshToken({ id: user._id });
            const tokeninserted = yield refreshtoken_1.default.create({
                token: refresh_token,
                user: user._id,
            });
            return res.status(200).json({
                user: toreturn,
                refresh_token,
                acess_token,
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({ err: err });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const result = yield usermodel_1.default.findOne({ username });
    if (!result) {
        return res.status(404).json({ err: "no user found" });
    }
    else {
        if (!bcrypt_1.default.compare(password, result.password)) {
            res.status(500).json({ msg: "wrong password" });
        }
        else {
            const acess_token = createAcessToken({ id: result._id });
            const refresh_token = createRefreshToken({ id: result._id });
            return res.status(200).json({
                user: {
                    username: result.username,
                    lastName: result.lastName,
                    firstName: result.firstName,
                    userid: result._id,
                },
                acess_token,
                refresh_token,
            });
        }
    }
});
exports.login = login;
const findUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.query.querystring;
        // const userquery = {
        //   $or: [
        //     { firstName: regexQuery },
        //     { username: regexQuery },
        //     { lastName: regexQuery },
        //   ],
        // };
        const user = yield usermodel_1.default
            .find({
            $or: [
                { firstName: { $regex: input } },
                { lastName: { $regex: input } },
                { username: { $regex: input } },
            ],
        })
            .select("username firstName lastName _id")
            .limit(10)
            .skip(Number(req.query.page) - 1 * 10);
        if (user)
            return res.status(200).json({ user });
        return res.status(404).send("not found");
    }
    catch (err) {
        console.log(err);
    }
});
exports.findUser = findUser;
const createAcessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30d",
    });
};
const createRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "30d",
    });
};
const generatenewacesstoken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.body.refreshToken;
        const refTokenOnDB = yield refreshtoken_1.default.find({ token: refreshToken });
        if (!refTokenOnDB) {
            return res.status(400).json({ err: "invalid refresh token" });
        }
        //@ts-expect-error
        const acesstoken = createAcessToken({ _id: refTokenOnDB.user });
        return res.status(200).json({ acesstoken });
    }
    catch (err) {
        console.log(err);
    }
});
exports.generatenewacesstoken = generatenewacesstoken;
const uploadProfilePic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const f = req.file;
        const fileUri = (0, dataUri_1.default)(f);
        const mycloud = yield cloudinary_1.default.v2.uploader.upload(fileUri.content);
        const update = yield usermodel_1.default.findByIdAndUpdate({ _id: req.body.id }, {
            profilepic: mycloud.secure_url,
        });
        res.status(200).json("hi");
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});
exports.uploadProfilePic = uploadProfilePic;
const follow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //to follow id on params
        if (req.params.id == req.body.id)
            return res.status(400).json({ err: "you cannot folllow yourself" });
        const alreadyFollowed = yield usermodel_1.default.findOne({ _id: req.params.id });
        if (alreadyFollowed && alreadyFollowed.followers.includes(req.body.id))
            return res.status(400).json({ err: "already following" });
        const follow = yield usermodel_1.default.findOneAndUpdate({ _id: req.params.id }, {
            $push: { followers: req.body.id }, //body ma userid
        });
        if (follow) {
            const following = yield usermodel_1.default.findOneAndUpdate({ _id: req.body.id }, {
                $push: { following: req.params.id },
            });
            if (!following) {
                return res.status(400).json("unable to add to following");
            }
            return res.status(200).json("followed");
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.follow = follow;
const unfollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield usermodel_1.default.findOne({ _id: req.params.id });
        if (!user)
            return res.status(404).json({ err: "Not found" });
        const res1 = yield usermodel_1.default.findOneAndUpdate({ _id: req.params.id }, {
            $pull: { followers: req.body.id },
        });
        if (!res1)
            return res.status(404).json({ err: "could not unfollow" });
        const res2 = yield usermodel_1.default.findOneAndUpdate({ _id: req.body.id }, {}, {
            $pull: { following: req.params.id },
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.unfollow = unfollow;
