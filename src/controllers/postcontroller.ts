import {
  express,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import mongoose from "mongoose";
import postinterface from "../interface/postinterface";

import PostModel from "../models/postmodel";
const getonepost: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await PostModel.findOne({ _id: id });
    if (!result) {
      return res.status(404).json("cannot find the post");
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
};
const getHomePosts: RequestHandler = async (req: Request, res: Response) => {
  const page: number = Number(req.params.page) || 1;

  const posts = PostModel.find();
  if (!posts) {
    return res.status(400).json({ err: "unable to retrive posts" });
  } else {
    const limit = 20;
    const skip = (page - 1) * limit;
    const postb = posts.skip(skip);
    const posta = postb.limit(limit);
    const toreturn = await posta;
    res.status(200).json({ msg: toreturn });
  }
};

const createPost: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    const body: postinterface = req.body;
    console.log(body ? "yes" : "no");
    const result = await PostModel.create({
      description: body.description,
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.username,
      userId: body.userId,
    });
    if (result) {
      res.status(200).json("Posted sucessfully");
    } else {
      res.status(500).json({ msg: "unable to create a new post" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
const unlikepost: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postid = req.params.id;
    const userid = req.body.userid;
    if (!userid) {
      return res.status(400).json("userid must be provided");
    }
    const post: postinterface = await PostModel.findOneAndUpdate(
      { _id: req.params.id, likes: userid },
      {
        $pull: { likes: userid },
      },
      { new: true }
    );
    if (!post) {
      return res
        .status(500)
        .json("unable to find or unlike post as you have not liked it ");
    } else {
      res.status(200).json("unliked the post");
    }
  } catch (err) {
    res.status(500).json({ err: err });
  }
};
const likepost: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userid: string = req.body.userid;
    console.log(typeof userid);
    if (!userid) {
      return res.status(500).json("userid must be sent");
    }
    const { id } = req.params;
    const post: postinterface = await PostModel.findOne(
      {
        _id: id,
        likes: userid,
      },
      { new: true }
    );
    if (post) {
      return res.status(500).json("you have already liked this post");
    } else {
      const posttolike = await PostModel.findOneAndUpdate(
        { _id: id },
        {
          $push: { likes: userid },
        },
        { new: true }
      );
      if (!posttolike) {
        res.status(500).json({ err: "unable to like the post" });
      } else {
        res.status(200).json("liked the post");
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export { createPost, likepost, getHomePosts, getonepost, unlikepost };
