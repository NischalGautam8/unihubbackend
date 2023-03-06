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
exports.generatenewacesstoken = exports.login = exports.register = void 0;
const usermodel_1 = __importDefault(require("../models/usermodel"));
const refreshtoken_1 = __importDefault(require("../models/refreshtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
        const user = yield usermodel_1.default.create({
            username: req.body.username,
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            email: req.body.email,
            gender: req.body.gender,
            password: yield bcrypt_1.default.hash(req.body.password, 10),
        }, { new: true });
        if (!user) {
            res.status(400).json("unable to create user");
        }
        else {
            console.log("user:", user);
            const acess_token = createAcessToken({ id: user._id });
            const refresh_token = createRefreshToken({ id: user._id });
            const tokeninserted = yield refreshtoken_1.default.create({
                token: refresh_token,
                user: new mongoose_1.default.Types.ObjectId(user._id),
            });
            console.log(refresh_token, acess_token, tokeninserted);
            return res.status(200).json({ refresh_token, acess_token });
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
        if (!(yield bcrypt_1.default.compare(password, result.password))) {
            res.status(500).json({ msg: "wrong password" });
        }
        else {
            const acess_token = createAcessToken({ id: result._id });
            const refresh_token = createRefreshToken({ id: result._id });
            return res.status(200).json({ acess_token, refresh_token });
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
        console.log(acesstoken);
        return res.status(200).json({ acesstoken });
    }
    catch (err) {
        console.log(err);
    }
});
exports.generatenewacesstoken = generatenewacesstoken;
