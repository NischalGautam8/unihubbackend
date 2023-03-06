import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
require("../passportmiddleware");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email profile"] })
);

router.get(
  "/callback",
  passport.authenticate(
    "google",
    {
      successRedirect: "http://localhost:5000/auth/success",
      failureRedirect: "http://localhost:5000/auth/failed",
    },
    (req: Request, res: Response) => {
      console.log(req.user);
    }
  )
);

router.get("/success", (req, res) => {
  res.send("Successfully logged in!");
});

router.get("/failed", (req, res) => {
  res.send("Failed to log in!");
});

export default router;
