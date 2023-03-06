import { commentinterface } from "../interface/commentinterface";
import mongoose from "mongoose";
import Post from "../models/postmodel";
import { Request, Response, RequestHandler } from "express";
import Comment from "../models/commentmodel";
import { postinterface } from "../interface/postinterface";
import comment from "../models/commentmodel";
const createcomment: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { content, userid, postid } = req.body;
    const post = Post.findOne({ _id: postid });
    console.log(typeof userid, typeof postid);
    if (!post) {
      return res.status(400).json({ msg: "no such post exists" });
    } else {
      const comment = await Comment.create({
        content: content,
        user: userid,
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

    const post: postinterface = await Post.findOne({ _id: postid });
    if (!post) {
      return res.status(400).json("unable to find post");
    } else {
      const commentidarr = post.comments;
      var newarr: Array<commentinterface> = [];
      await Promise.all(
        commentidarr.map(async (element) => {
          const commentofpost: commentinterface = await Comment.findOne({
            _id: element,
          });
          newarr.push(commentofpost);
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
//like comment
//may be jump onto making the ui now make a news feed
export { createcomment, getcomments };
