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
exports.follow = exports.getFollwing = exports.uploadProfilePic = exports.generatenewacesstoken = exports.login = exports.register = void 0;
const usermodel_1 = __importDefault(require("../models/usermodel"));
const refreshtoken_1 = __importDefault(require("../models/refreshtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dataUri_1 = __importDefault(require("../utils/dataUri"));
const cloudinary_1 = __importDefault(require("cloudinary"));
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
        const usernametaken = yield usermodel_1.default.findOne({ username: req.body.username });
        if (usernametaken)
            return res.status(400).json({ err: "username is already taken" });
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
        if (!(bcrypt_1.default.compare(password, result.password))) {
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
const createAcessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30s",
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
        const acesstoken = createAcessToken({ _id: refTokenOnDB.user });
        return res.status(200).json({ acesstoken });
    }
    catch (err) {
        console.log(err);
    }
});
exports.generatenewacesstoken = generatenewacesstoken;
const getFollwing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const following = yield usermodel_1.default
            .findOne({ _id: req.params.id })
            .populate("following", "-password -followers  -createdAt -updatedAt");
        if (!following) {
            return res.status(404).json("cannot get following");
        }
        return res.status(200).json({ following: following.following });
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});
exports.getFollwing = getFollwing;
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
