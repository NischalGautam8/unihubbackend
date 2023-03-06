"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
require("../passportmiddleware");
const router = express_1.default.Router();
router.get("/google", passport_1.default.authenticate("google", { scope: ["email profile"] }));
router.get("/callback", passport_1.default.authenticate("google", {
    successRedirect: "http://localhost:5000/auth/success",
    failureRedirect: "http://localhost:5000/auth/failed",
}, (req, res) => {
    console.log(req.user);
}));
router.get("/success", (req, res) => {
    res.send("Successfully logged in!");
});
router.get("/failed", (req, res) => {
    res.send("Failed to log in!");
});
exports.default = router;
