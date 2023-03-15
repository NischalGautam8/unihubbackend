import usermodel from "../models/usermodel";
import refreshTokenModel from "../models/refreshtoken";
import { RequestHandler, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { userinterface } from "../interface/userinterface";
const register: RequestHandler = async (req: Request, res: Response) => {
  try {
    if (req.body.password.length < 6) {
      return res
        .status(400)
        .json({ msg: "password must be at least 6 characters" });
    }
    if (!req.body.username) {
      return res.status(400).json("username is required");
    }
    const user: userinterface = await usermodel.create(
      {
        username: req.body.username,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        email: req.body.email,
        gender: req.body.gender,
        password: await bcrypt.hash(req.body.password, 10),
      },
      { new: true }
    );
    if (!user) {
      res.status(400).json("unable to create user");
    } else {
      console.log("user:", user);
      const acess_token = createAcessToken({ id: user._id });
      const refresh_token = createRefreshToken({ id: user._id });
      const tokeninserted = await refreshTokenModel.create({
        token: refresh_token,
        user: new mongoose.Types.ObjectId(user._id),
      });
      console.log(refresh_token, acess_token, tokeninserted);
      console.log(user);
      return res.status(200).json({
        user: {
          username: user.username,
          lastName: user.lastName,
          firstName: user.firstName,
          userid: user._id,
        },
        refresh_token,
        acess_token,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ err: err });
  }
};
const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const result = await usermodel.findOne({ username });
  if (!result) {
    return res.status(404).json({ err: "no user found" });
  } else {
    if (!(await bcrypt.compare(password, result.password))) {
      res.status(500).json({ msg: "wrong password" });
    } else {
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
};
const createAcessToken = (payload: object) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "30s",
  });
};
const createRefreshToken = (payload: object) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "30d",
  });
};
const generatenewacesstoken: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const refreshToken = req.body.refreshToken;
    const refTokenOnDB = await refreshTokenModel.find({ token: refreshToken });
    if (!refTokenOnDB) {
      return res.status(400).json({ err: "invalid refresh token" });
    }
    const acesstoken = createAcessToken({ _id: refTokenOnDB.user });
    console.log(acesstoken);
    return res.status(200).json({ acesstoken });
  } catch (err) {
    console.log(err);
  }
};
export { register, login, generatenewacesstoken };
