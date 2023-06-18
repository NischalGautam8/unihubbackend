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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const conversationmodel_1 = __importDefault(require("../models/conversationmodel"));
const canViewMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authheaders = req.headers.authorization;
        if (authheaders) {
            var jwt = authheaders.split(" ")[1];
        }
        if (!jwt)
            return res.status(400).json({ err: "provide jwt" });
        jsonwebtoken_1.default.verify(jwt, "jfjfjadklfjdskjfkdjfJkjkJKLJK45049DKLSC", (err, user) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.status(400).send("invalid jwt");
            }
            else {
                const convo = yield conversationmodel_1.default
                    .findOne({ _id: req.params.id })
                    .select("users");
                if (convo === null || convo === void 0 ? void 0 : convo.users.includes(user.id)) {
                    return next();
                }
            }
        }));
    }
    catch (err) {
        console.log(err);
    }
});
exports.default = canViewMessage;
