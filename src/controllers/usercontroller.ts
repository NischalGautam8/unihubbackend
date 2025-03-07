import usermodel from "../models/usermodel";
import refreshTokenModel from "../models/refreshtoken";
import { RequestHandler, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userinterface } from "../interface/userinterface";
import postmodel from "../models/postmodel";
import getDataUri from "../utils/dataUri";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
const getUserInfo: RequestHandler = async (req: Request, res: Response) => {
  try {
    const user = await usermodel
      .findOne({ _id: req.params.userid })
      .select(
        "firstName lastName username profilepic gender createdAt followers following"
      );

    if (!user) {
      return res.status(404).json({ err: "User does not exist" });
    }

    console.log("Requesting", req.query.myid);

    // Convert req.query.myid to ObjectId for proper comparison
    const myId = req.query.myid as string;
    const myObjectId = mongoose.Types.ObjectId.isValid(myId)
      ? new mongoose.Types.ObjectId(myId)
      : null;

    const toreturn = {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      createdAt: user.createdAt,
      profilepic: user.profilepic,
      gender: user.gender,
      followerCount: user.followers.length,
      followingCount: user.following.length,
      doYouFollow: myObjectId
        ? user.followers.some((followerId) => followerId.equals(myObjectId))
        : false, // Ensure proper ObjectId comparison
    };

    return res.status(200).json({ user: toreturn });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "An error occurred" });
  }
};

const getFollowers: RequestHandler = async (req: Request, res: Response) => {
  try {
    const page = req.query.page || 1;
    const skip = (Number(page) - 1) * 30;
    //@ts-expect-error
    const user: userinterface = await usermodel
      .findOne({ _id: req.params.id })
      .populate("followers", "-password   -email  -createdAt -updatedAt")
      .skip(skip);
    if (!user) {
      return res.status(404).send("no user found");
    } else {
      console.log(user);
      //@ts-expect-error
      const toreturn = user.followers.map((follower: userinterface) => {
        const obj = {
          _id: follower._id,
          firstName: follower.firstName,
          lastName: follower.lastName,
          //@ts-expect-error
          doYouFollow: follower.followers.includes(req.query.id),
        };
        return obj;
      });
      console.log(toreturn);
      return res.status(200).json({
        followers: toreturn,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
const getFollwing = async (req: Request, res: Response) => {
  try {
    const page = req.query.page || 1;
    const skip = (Number(page) - 1) * 30;
    //@ts-expect-error
    const user: userinterface = await usermodel
      .findOne({ _id: req.params.id })
      .populate("following", "-password -email  -createdAt -updatedAt")
      .skip(skip);
    if (!user) {
      return res.status(404).json("cannot get following");
    }
    //@ts-expect-error
    const toreturn = user.following.map((follower: userinterface) => {
      const obj = {
        _id: follower._id,
        firstName: follower.firstName,
        lastName: follower.lastName,
        //@ts-expect-error
        doYouFollow: follower.followers.includes(req.query.id),
        //@ts-expect-error
        isFriend: follower.following.includes(req.params.id),
      };
      return obj;
    });
    return res.status(200).json({ following: toreturn });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

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
    if (!req.body.firstName) {
      return res.status(400).json("firstName is required");
    }
    if (!req.body.lastName) {
      return res.status(400).json("lastName is required");
    }
    const usernametaken = await usermodel.findOne({
      username: req.body.username,
    });
    if (usernametaken)
      return res.status(400).json({ err: "username is already taken" });
    //@ts-expect-error
    const user: userinterface = await usermodel.create({
      username: req.body.username,
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      email: req.body.email,
      gender: req.body.gender,
      password: await bcrypt.hash(req.body.password, 10),
    });

    if (!user) {
      res.status(400).json("unable to create user");
    } else {
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
      const tokeninserted = await refreshTokenModel.create({
        token: refresh_token,
        user: user._id,
      });

      return res.status(200).json({
        user: toreturn,
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
    if (!bcrypt.compare(password, result.password as string)) {
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
const findUser = async (req: Request, res: Response) => {
  try {
    const input = req.query.querystring;
    // const userquery = {
    //   $or: [
    //     { firstName: regexQuery },
    //     { username: regexQuery },
    //     { lastName: regexQuery },
    //   ],
    // };

    const user = await usermodel
      .find({
        $or: [
          { firstName: { $regex: input } },
          { lastName: { $regex: input } },
          { username: { $regex: input } },
        ],
      })
      .select("username firstName lastName _id")
      .limit(10)
      .skip(Number(req.query.page) - 1 * 10);
    if (user) return res.status(200).json({ user });
    return res.status(404).send("not found");
  } catch (err) {
    console.log(err);
  }
};
const createAcessToken = (payload: object) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "30d",
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
    //@ts-expect-error
    const acesstoken = createAcessToken({ _id: refTokenOnDB.user });
    return res.status(200).json({ acesstoken });
  } catch (err) {
    console.log(err);
  }
};

const uploadProfilePic = async (req: any, res: Response) => {
  try {
    const f = req.file;
    const fileUri = getDataUri(f);
    const mycloud = await cloudinary.v2.uploader.upload(
      fileUri.content as string
    );
    const update = await usermodel.findByIdAndUpdate(
      { _id: req.body.id },
      {
        profilepic: mycloud.secure_url,
      }
    );
    res.status(200).json("hi");
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
const follow = async (req: Request, res: Response) => {
  try {
    //to follow id on params
    if (req.params.id == req.body.id)
      return res.status(400).json({ err: "you cannot folllow yourself" });
    const alreadyFollowed = await usermodel.findOne({ _id: req.params.id });
    if (alreadyFollowed && alreadyFollowed.followers.includes(req.body.id))
      return res.status(400).json({ err: "already following" });
    const follow = await usermodel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { followers: req.body.id }, //body ma userid
      }
    );
    if (follow) {
      const following = await usermodel.findOneAndUpdate(
        { _id: req.body.id },
        {
          $push: { following: req.params.id },
        }
      );
      if (!following) {
        return res.status(400).json("unable to add to following");
      }
      return res.status(200).json("followed");
    }
  } catch (err) {
    console.log(err);
  }
};
const unfollow = async (req: Request, res: Response) => {
  try {
    const user = await usermodel.findOne({ _id: req.params.id });
    if (!user) return res.status(404).json({ err: "Not found" });
    const res1 = await usermodel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: { followers: req.body.id },
      }
    );
    if (!res1) return res.status(404).json({ err: "could not unfollow" });
    const res2 = await usermodel.findOneAndUpdate(
      { _id: req.body.id },
      {},
      {
        $pull: { following: req.params.id },
      }
    );
  } catch (err) {
    console.log(err);
  }
};
export {
  register,
  login,
  generatenewacesstoken,
  uploadProfilePic,
  getFollwing,
  getFollowers,
  follow,
  unfollow,
  getUserInfo,
  findUser,
};  
