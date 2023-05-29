import { NextFunction, Request, RequestHandler, Response } from "express";
import { Document } from "mongoose";
import PostModel from "../models/postmodel";
import { postinterface } from "../interface/postinterface";
interface extendedPostInterfece extends postinterface {
  comments: Array<String>;
  likes: Array<String>;
}
const getonepost: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await PostModel.findOne({ _id: id }).populate({
      path: "userId",
      select: "_id username lastName firstName  ",
    });
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
  const userid: string = req.query.userid as string;

  const postsQuery = PostModel.find().populate({
    path: "userId",
    select: "_id username lastName firstName",
  });
  //TODO : SEND likes and comment count sepertely

  const limit = 20;
  const skip = (page - 1) * limit;
  const postsQueryPaginated = postsQuery.skip(skip).limit(limit);
  const toreturn: extendedPostInterfece[] = await postsQueryPaginated.exec();
  const modifiedPosts = toreturn.map((post) => {
    const modifiedPost = post.toObject();
    modifiedPost.commentsCount = post.comments.length;
    modifiedPost.likesCount = post.likes.length;
    modifiedPost.hasLiked = post.likes.includes(userid);
    delete modifiedPost.comments;
    delete modifiedPost.likes;
    return modifiedPost;
  });
  res.status(200).json({ msg: modifiedPosts });
};

const createPost: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    const { userId, description } = req.body;
    const result = await PostModel.create({
      description: description,
      userId,
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
    const post = await PostModel.findOneAndUpdate(
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
    const post = await PostModel.findOne(
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
const getUserPosts: RequestHandler = async (req: Request, res: Response) => {
  try {
    const page: number = Number(req.params.page) || 1;
    const userId: string = req.params.id as string;

    const postsQuery = PostModel.find({ userId: userId }).populate({
      path: "userId",
      select: "_id username lastName firstName",
    });
    //TODO : SEND likes and comment count sepertely

    const limit = 20;
    const skip = (page - 1) * limit;
    const postsQueryPaginated = postsQuery.skip(skip).limit(limit);
    const toreturn: extendedPostInterfece[] = await postsQueryPaginated.exec();
    const modifiedPosts = toreturn.map((post) => {
      const modifiedPost = post.toObject();
      modifiedPost.commentsCount = post.comments.length;
      modifiedPost.likesCount = post.likes.length;
      modifiedPost.hasLiked = post.likes.includes(userId);
      delete modifiedPost.comments;
      delete modifiedPost.likes;
      return modifiedPost;
    });
    res.status(200).json({ msg: modifiedPosts });
  } catch (err) {
    console.log(err)
  }
};
export {
  createPost,
  likepost,
  getHomePosts,
  getonepost,
  unlikepost,
  getUserPosts,
};
