"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyOwner = (req, res, next) => {
    try {
        const { jwt, owner } = req.body;
        if (!jwt) {
            res.status(404).send("no jwt provided");
        }
        jsonwebtoken_1.default.verify(jwt, "jfjfjadklfjdskjfkdjfJkjkJKLJK45049DKLSC", (err, user) => {
            if (err) {
                res.status(400).send("invalid jwt");
            }
            else {
                if (user.id == owner) {
                    next();
                }
                return res.status(400).send("you are not the author");
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};
exports.default = verifyOwner;
