import mongoose from "mongoose";
import { Request, Response, RequestHandler } from "express";
import conversationmodel from "../models/conversationmodel";
import messageModel from "../models/messagemodel";
import { userinterface } from "../interface/userinterface";
const newMessageSocket = async (
  messageData: string,
  room: string,
  sender: string,
  receiver: string
) => {
  try {
    const message = await messageModel.create({
      conversation: room,
      content: messageData,
      sender,
      receiver,
    });
    if (message) {
      const conversation = await conversationmodel.findOneAndUpdate(
        { _id: room },
        {
          $push: { messages: message._id },
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
};
const createConversation: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, users }: { name: string; users: Array<userinterface> } =
      req.body;
    console.log("name", name, users);
    const newConversation = await conversationmodel.create({
      name: name,
      users: users,
    });
    if (!newConversation) {
      return res.status(400).json("cannot create a new conversation");
    }

    return res.status(200).json(newConversation);
  } catch (err) {
    console.log(err);
  }
};
const createMessage = async (req: Request, res: Response) => {
  try {
    const message = await messageModel.create({
      conversation: req.body.conversationid,
      content: req.body.content,
      sender: req.body.sender,
      receiver: req.body.receiver,
    });
    if (!message) {
      return res.status(400).json("unable to add message");
    }
    const updated = await conversationmodel.findOneAndUpdate(
      {
        _id: req.body.conversationid,
      },
      {
        $push: { messages: message._id },
      }
    );
    console.log(updated);
    if (!updated) {
      return res
        .status(400)
        .json("could not update conversation with message id");
    }
    return res.status(200).json("new message created");
  } catch (err) {
    console.log(err);
  }
};
const getConversationAndMessages = async (req: Request, res: Response) => {
  try {
    const conversationid = req.params.id;
    const page: number = Number(req.query.page) || 1;
    const skip = 25 * (page - 1);
    const conversation = await conversationmodel
      .findOne({ _id: conversationid })
      .populate({ path: "messages", options: { limit: 25, skip: skip } })
      .populate(
        "users",
        "-password -followers -following -createdAt -updatedAt"
      );
    if (!conversation) {
      return res.status(400).json("couldnot find convo");
    }
    return res.status(200).json({ conversation });
  } catch (err) {
    console.log(err);
  }
};
const getConversations = async (req: Request, res: Response) => {
  try {
    const userid = req.query.userid;
    console.log(userid);
    const conversations = await conversationmodel.find({
      users: { $elemMatch: { $eq: userid } },
    });
    if (!conversations) {
      return res.status(400).json("cannot find conversations");
    }
    return res.status(200).json(conversations);
  } catch (err) {
    console.log(err);
  }
};
export {
  createConversation,
  getConversations,
  getConversationAndMessages,
  createMessage,
  newMessageSocket,
};
