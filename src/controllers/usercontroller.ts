import { Request, Response, RequestHandler } from "express";
import mongoose from "mongoose";
import usermodel from "../models/usermodel";
const getUserInfo: RequestHandler = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userid)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await usermodel
      .findOne({ _id: req.params.userid })
      .select(
        "firstName lastName username profilepic gender createdAt followers following"
      );

    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

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
      //@ts-expect-error
        ? user.followers.some((followerId) => followerId.equals(myObjectId))
        : false,
    };

    return res.status(200).json({ user: toreturn });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
};

const follow: RequestHandler = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id) || !mongoose.Types.ObjectId.isValid(req.body.id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    if (req.params.id === req.body.id) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const alreadyFollowed = await usermodel.findOne({ _id: req.params.id });
    if (alreadyFollowed && alreadyFollowed.followers.includes(req.body.id)) {
      return res.status(400).json({ error: "Already following" });
    }

    await usermodel.findByIdAndUpdate(
      req.params.id,
      { $push: { followers: req.body.id } },
      { new: true }
    );

    await usermodel.findByIdAndUpdate(
      req.body.id,
      { $push: { following: req.params.id } },
      { new: true }
    );

    return res.status(200).json({ message: "Followed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
};

const unfollow: RequestHandler = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id) || !mongoose.Types.ObjectId.isValid(req.body.id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    await usermodel.findByIdAndUpdate(
      req.params.id,
      { $pull: { followers: req.body.id } },
      { new: true }
    );

    await usermodel.findByIdAndUpdate(
      req.body.id,
      { $pull: { following: req.params.id } },
      { new: true }
    );

    return res.status(200).json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
};

export { getUserInfo, follow, unfollow };