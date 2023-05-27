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
import notesModel from "../models/notesmodel";
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
//////Notes///////
const createNotesComment: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const noteid: string = req.params.id;
    const { content, userid } = req.body;
    const note = notesModel.findOne({ _id: noteid });
    console.log(typeof userid, typeof noteid);
    if (!note) {
      return res.status(400).json({ msg: "no such note exists" });
    } else {
      console.log(userid);
      const comment = await Comment.create({
        content: content,
        user: userid,
        postid: noteid,
      });
      if (!comment) {
        res.status(400).json({ msg: "unable to create a comment" });
      } else {
        await notesModel.findOneAndUpdate(
          { _id: noteid },
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
const getNotesComment = async (req: Request, res: Response) => {
  try {
    const note = await notesModel.findOne({ _id: req.params.id }).populate({
      path: "comments",
      populate: {
        path: "user",
        select: "_id username lastName firstName",
      },
    });
    if (note) {
      return res.status(200).json({ msg: note.comments });
    }
    return res.status(400).json("note not found");
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
const getcomments: RequestHandler = async (req: Request, res: Response) => {
  try {
    const postcomments = await Post.findOne({ _id: req.params.id }).populate({
      path: "comments",
      populate: {
        path: "user",
        select: "_id username lastName firstName",
      },
    });
    if (postcomments) {
      return res.status(200).json({ msg: postcomments.comments });
    }
    return res.status(400).json("post/comment not found");
  } catch (err) {
    console.log(err);
  }
};
const createReply = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newreply = await Comment.create({
      content: req.body.content,
      user: req.body.userid,
      postid: req.params.id, //this time the post will be another comment so provide comment id
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
    const replies = await comment.findOne({ _id: req.params.id }).populate({
      path: "replies",
      populate: {
        path: "user",
        select: "_id username lastName firstName",
      },
    });
    if (replies) {
      return res.status(200).json({ msg: replies.replies });
    }
    return res.status(400).json("post/comment not found");
  } catch (err) {
    console.log(err);
  }
};

//like comment
//may be jump onto making the ui now make a news feed
export {
  createcomment,
  getcomments,
  createReply,
  getReply,
  createNotesComment,
  getNotesComment,
};
