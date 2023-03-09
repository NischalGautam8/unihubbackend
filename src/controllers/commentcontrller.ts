import { commentinterface } from "../interface/commentinterface";
import mongoose from "mongoose";
import Post from "../models/postmodel";
import {
  Request,
  Response,
  RequestHandler,
  NextFunction,
  request,
} from "express";
import Comment from "../models/commentmodel";
import { postinterface } from "../interface/postinterface";
import comment from "../models/commentmodel";
import comment from "../models/commentmodel";
const createcomment: RequestHandler = async (req: Request, res: Response) => {
  try {
    const postid: string = req.params.id;
    const { content, userid } = req.body;
    const post = Post.findOne({ _id: postid });
    console.log(typeof userid, typeof postid);
    if (!post) {
      return res.status(400).json({ msg: "no such post exists" });
    } else {
      const comment = await Comment.create({
        content: content,
        user: userid,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        username: req.body.username,
        postid: postid,
      });
      if (!comment) {
        res.status(400).json({ msg: "unable to create a comment" });
      } else {
        await post.findOneAndUpdate(
          { _id: postid },
          {
            $push: { comments: comment._id },
          },
          { new: true }
        );
        res.status(200).json("comment added sucessfully");
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
};
const getcomments: RequestHandler = async (req: Request, res: Response) => {
  try {
    const postid = req.params.id;
    console.log(postid);

    const post: postinterface | null = await Post.findOne({ _id: postid });
    if (!post) {
      return res.status(400).json("unable to find post");
    } else {
      const commentidarr = post.comments;
      var newarr: Array<commentinterface> = [];
      await Promise.all(
        commentidarr.map(async (element) => {
          const commentofpost: commentinterface | null = await Comment.findOne({
            _id: element,
          });
          commentofpost && newarr.push(commentofpost);
          newarr = newarr.filter((element) => element != null);
          // console.log(commentofpost);
        })
      );
      console.log(newarr);
      res.status(200).json({ msg: newarr });
    }
  } catch (err) {
    console.log(err);
  }
};
const createReply = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newreply = await Comment.create({
      content: req.body.content,
      user: req.body.userid,
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      username: req.body.username,
      postid: req.params.id, //this time the post will be another comment
    });
    if (!newreply) {
      return res.status(500).json("unable to create a new comment");
    }
    const reply = await Comment.findOneAndUpdate(
      { _id: req.params.id }, //id for comment to which we want to reply
      {
        $push: { replies: newreply._id },
      }
    );
    if (!reply) {
      return res.status(500).json("unable to create a reply");
    }
    res.status(200).json("reply added to the comment");
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};
const getReply: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentid = req.params.id;
    const thatcomment: commentinterface | null = await comment.findOne({
      _id: commentid,
    });
    if (!thatcomment) {
      return res.status(404).json("comment doesnot exist");
    }
    var newArr: Array<commentinterface> = [];
    console.log("replies", thatcomment);
    const repliesIdArr = thatcomment.replies;
    console.log(repliesIdArr);
    await Promise.all(
      repliesIdArr.map(async (element) => {
        const singlereply = await comment.findOne({ _id: element });
        singlereply && newArr.push(singlereply);
        newArr = newArr.filter((element) => element != null);
      })
    );
    res.status(200).json({ msg: newArr });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};

//like comment
//may be jump onto making the ui now make a news feed
export { createcomment, getcomments, createReply, getReply };
