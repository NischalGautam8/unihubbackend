"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    try {
        let { jwt } = req.body;
        if (!jwt) {
            const authheaders = req.headers.authorization;
            if (authheaders) {
                jwt = authheaders.split(" ")[1];
            }
            else {
                return res.status(400).send("no jwt provided");
            }
        }
        jsonwebtoken_1.default.verify(jwt, "jfjfjadklfjdskjfkdjfJkjkJKLJK45049DKLSC", (err, user) => {
            if (err) {
                console.log(err);
                res.status(400).send("invalid jwt");
            }
            else {
                next();
            }
        });
    }
    catch (err) {
        res.status(404).send(err);
    }
};
exports.verifyToken = verifyToken;
