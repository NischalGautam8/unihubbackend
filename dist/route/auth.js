"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport = require("passport");
const router = express_1.default.Router();
router.get("/login/sucess", (req, res) => {
    if (req.user) {
        res.status(200).json({
            error: false,
            message: "Sucessfully logged in",
            user: req.user,
        });
    }
    else {
        res.status(403).json({ error: true, message: "Not authorized" });
    }
});
router.get("/google", passport.authenticate("google"));
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: process.env.CLIENT_URL,
//     failureRedirect: "/login/failed",
//   })
// );
// router.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect(process.env.CLIENT_URL);
// });
exports.default = router;
