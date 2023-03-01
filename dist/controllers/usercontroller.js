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
exports.login = exports.register = void 0;
const usermodel_1 = __importDefault(require("../models/usermodel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
            res.status(200).json({ user });
        }
    }
    catch (err) {
        return res.status(400).send({ err: err });
        console.log(err);
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
            const token = jsonwebtoken_1.default.sign({ username: username, lastname: result.lastName }, "secretkey123");
            return res.status(500).json({ token });
        }
    }
});
exports.login = login;
