import { NextFunction, Request, RequestHandler, Response } from "express";
import PostModel from "../models/postmodel";
import {
  originalpostinterface,
  postinterface,
} from "../interface/postinterface";
import usermodel from "../models/usermodel";
import getDataUri from "../utils/dataUri";
import cloudinary from "cloudinary";
import { returnablePost } from "../utils/returnablePosts";
interface extendedPostInterfece extends postinterface {
  comments: Array<String>;
  likes: Array<String>;
  saved: Array<String>;
}
const getonepost: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    let userid = req.query.userid as string; //the user that request for the post, we will have to see if he has liked the post or not in the server
    if (!userid) {
      userid = "";
    }
    console.log(id);
    const result = await PostModel.findOne({ _id: id }).populate({
      path: "userId",
      select: "_id username lastName firstName  ",
    });
    if (!result) {
      return res.status(404).json("cannot find the post");
    } else {
      const toreturn = {
        _id: result._id,
        userId: result.userId,
        description: result.description,
        image: result.image,
        commentsCount: result.comments.length,
        likesCount: result.likes.length,
        //@ts-expect-error
        hasLiked: result.likes.includes(userid),
      };
      res.status(200).json(toreturn);
    }
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
};
const getHomePosts: RequestHandler = async (req: Request, res: Response) => {
  const page: number = Number(req.query.page) || 1;
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
  // const modifiedPosts = toreturn.map((post) => {
  //   const modifiedPost = post.toObject();
  //   modifiedPost.commentsCount = post.comments.length;
  //   modifiedPost.likesCount = post.likes.length;
  //   modifiedPost.hasLiked = post.likes.includes(userid);
  //   delete modifiedPost.comments;
  //   delete modifiedPost.likes;
  //   return modifiedPost;
  // });
  res.status(200).json({ msg: returnablePost(toreturn, userid) });
};
const savePost: RequestHandler = async (req: Request, res: Response) => {
  try {
    const insert = await usermodel.findOneAndUpdate(
      { _id: req.body.id },
      {
        $push: { saved: req.params.id },
      }
    );
    if (!insert) {
      return res.status(400).json({ err: "unable to save post" });
    }
    return res.status(200).send("saved post");
  } catch (err) {
    console.log(err);
  }
};
const findPost = async (req: Request, res: Response) => {
  try {
    const input = req.query.querystring;
    const userid = req.query.userid;
    console.log("input", input);
    const posts: Array<originalpostinterface> = await PostModel.find({
      $or: [{ description: { $regex: input } }],
    })
      .limit(10)
      .skip(Number(req.query.page) - 1)
      .populate({ path: "userId", select: "_id username lastName firstName" });
    if (!posts) return res.status(404).send("not found");
    return res
      .status(200)
      .json({ posts: returnablePost(posts, userid as string) });
  } catch (err) {
    console.log(err);
  }
};
const unsavePost: RequestHandler = async (req: Request, res: Response) => {
  try {
    const remove = await usermodel.findOneAndUpdate(
      { _id: req.body.id },
      {
        $pull: { saved: req.params.id },
      }
    );
    if (!remove) {
      return res.status(400).json({ err: "unable to unsave post" });
    }
    return res.status(200).send("saved post");
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
const getSavedPosts: RequestHandler = async (req: Request, res: Response) => {
  try {
    const page: number = Number(req.query.page) || 1;
    const userid: string = req.params.id as string;
    const limit = 20;
    const skip = (page - 1) * limit;
    const savedposts = usermodel
      .findOne({ _id: req.params.id })
      .populate({ path: "saved" })
      .skip(skip);
    //@ts-expect-error
    const toreturn: extendedPostInterfece[] = await savedposts.exec();
    //@ts-expect-error
    // const modifiedPosts = toreturn.saved.map((post) => {
    //   const modifiedPost = post.toObject();
    //   modifiedPost.commentsCount = post.comments.length;
    //   modifiedPost.likesCount = post.likes.length;
    //   modifiedPost.hasLiked = post.likes.includes(userid);
    //   delete modifiedPost.comments;
    //   delete modifiedPost.likes;
    //   return modifiedPost;
    // });
    res.status(200).json({ msg: returnablePost(toreturn) });
  } catch (err) {
    console.log(err);
  }
};

const createPost: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, description } = req.body;
    const file = req.file;
    let result;
    if (file) {
      const uri = getDataUri(file);
      if (uri.content) {
        var uploaded = await cloudinary.v2.uploader.upload(uri.content);
        result = await PostModel.create({
          description: description,
          userId,
          image: uploaded.secure_url,
        });
      }
    } else {
      result = await PostModel.create({
        description: description,
        userId,
      });
    }

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
    if (!userid) {
      return res.status(500).json("userid must be sent");
    }
    const { id } = req.params;
    console.log("id", id);
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
    const page: number = Number(req.query.page) || 1;
    const userId: string = req.params.id as string;
    const myid: string = (req.query.myid as string) || "";
    const postsQuery = PostModel.find({ userId: userId }).populate({
      path: "userId",
      select: "_id username lastName firstName",
    });
    //TODO : SEND likes and comment count sepertely

    const limit = 20;
    const skip = (page - 1) * limit;
    const postsQueryPaginated = postsQuery.skip(skip).limit(limit);
    //@ts-expect-error
    const toreturn: extendedPostInterfece[] = await postsQueryPaginated.exec();
    const modifiedPosts = toreturn.map((post) => {
      const modifiedPost = post.toObject();
      modifiedPost.commentsCount = post.comments.length;
      modifiedPost.likesCount = post.likes.length;
      modifiedPost.hasLiked = post.likes.includes(myid);
      delete modifiedPost.comments;
      delete modifiedPost.likes;
      return modifiedPost;
    });
    res.status(200).json({ msg: modifiedPosts });
  } catch (err) {
    console.log(err);
  }
};
export {
  createPost,
  likepost,
  getHomePosts,
  getonepost,
  unlikepost,
  savePost,
  unsavePost,
  getSavedPosts,
  getUserPosts,
  findPost,
};
