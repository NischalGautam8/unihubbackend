import { RequestHandler, Request, Response } from "express";
import notesModel from "../models/notesmodel";
import getDataUri from "../utils/dataUri";
import cloudinary from "cloudinary";
import comment from "../models/commentmodel";
interface MyMap {
  [key: string]: number;
}
const getRating = async (req: Request, res: Response) => {
  try {
    const doc = await notesModel.findOne({ _id: req.params.id });
    if (!doc) return res.status(400).send("not found any note");
    const hashmap = new Map(doc.ratingsMap);
    if (hashmap) {
      console.log(hashmap);
      const size = hashmap.size;
      const sum = Array.from(hashmap.values()).reduce<number>(
        (acc, cur) => acc + Number(cur),
        0
      );
      console.log("sum", sum);
      console.log("size", size);
      return res.status(200).json({
        rating: sum / size,
        noOfRating: size,
        prevRated: hashmap?.get(req.body.userid),
      });
    }
    return res.status(400).send("not found");
  } catch (err) {
    console.log(err);
  }
};
const setRating = async (req: Request, res: Response) => {
  try {
    const { userid, rating } = req.body;
    if (!isFinite(Number(rating))) {
      return res.status(400).send("not a finite value");
    }
    if (Number(rating) > 5) {
      return res.status(400).send("can't rate more than 5");
    }
    const doc = await notesModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          [`ratingsMap.${userid}`]: rating,
        },
      },
      { new: true }
    );
    if (!doc) return res.status(400).send("unable to rate the note");
    const hashmap: Map<string, string> = doc.ratingsMap;
    const size = hashmap?.size;
    const sum = Array.from(hashmap.values()).reduce<number>(
      (acc, cur) => acc + Number(cur),
      0
    );
    console.log(sum);
    return res.status(200).json({ rating: sum / size });
  } catch (err) {
    console.log(err);
  }
};
const getSingleNote = async (req: Request, res: Response) => {
  try {
    console.log(req.params.id);
    console.log(req.query.userid);
    const note = await notesModel.findOne({ _id: req.params.id }).populate({
      path: "uploadedBy",
      select: "_id username firstName lastName",
    });
    if (note) {
      const hashmap = new Map(note.ratingsMap);
      const size = hashmap.size;
      const sum = Array.from(hashmap.values()).reduce<number>(
        (acc, cur) => acc + Number(cur),
        0
      );
      return res.status(200).json({
        note,
        rating: sum / size,
        noOfRating: size,
        prevRated: hashmap?.get(req.query.userid) || " 0",
      });
    } else {
      res.status(400).send("note not found");
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
const getUserNotes: RequestHandler = async (req: Request, res: Response) => {
  try {
    const page = req.query.page || 1;
    const skip = (Number(page) - 1) * 30;

    const userNotes = await notesModel
      .find({
        uploadedBy: req.params.id,
      })
      .select("_id  uploadedBy, name url size createdAt")
      .populate({
        path: "uploadedBy",
        select: "_id username lastName firstName",
      })
      .skip(skip)
      .sort("-createdAt");
    if (!userNotes) {
      return res.status(404).send("not found");
    }

    return res.status(200).json({ notes: userNotes });
  } catch (err) {
    console.log(err);
  }
};
const getNotes: RequestHandler = async (req: Request, res: Response) => {
  try {
    const page: Number = Number(req.query.page) || 1;
    const subject: string | null = req.query.subject?.toString() || null;
    console.log(subject);
    const result = notesModel
      .find(subject ? { subject } : {})
      .select(" _id uploadedBy  name url size createdAt")
      .skip((Number(page) - 1) * 30)
      .limit(30)
      .populate({
        path: "uploadedBy",
        select: "_id username lastName firstName ",
      })
      .sort("-createdAt");
    const notes = await result;

    return res.status(200).json({ notes });
  } catch (err) {
    return res.status(400).json(err);
  }
};
const findNote = async (req: Request, res: Response) => {
  try {
    const input = req.body.input;
    const note = await notesModel.find({
      $or: [{ name: { $regex: input } }, { subject: { $regex: input } }],
    });
    if (!note) res.status(404).send("not found");
    return res.status(200).json(note);
  } catch (err) {
    console.log(err);
  }
};
const uploadNote = async (req: any, res: any) => {
  try {
    const file = req.file;
    console.log(file);
    const uri = getDataUri(file);
    const uploaded = await cloudinary.v2.uploader.upload(uri.content);
    console.log(uploaded.secure_url);
    const newFile = await notesModel.create({
      name: req.body.name,
      uploadedBy: req.body.uploadedBy,
      size: uploaded.bytes / (1024 * 1024),
      url: uploaded.secure_url,
      subject: req.body.subject?.toLowerCase(),
      totalrating: 0,
      ratingsMap: new Map(),
    });
    console.log(uploaded.secure_url);
    res.status(200).send("uploaded");
  } catch (err) {
    res.status(400).json({ err });
    console.log(err);
  }
};
export {
  uploadNote,
  getNotes,
  getSingleNote,
  getRating,
  setRating,
  getUserNotes,
  findNote,
};
