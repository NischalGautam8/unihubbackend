import { RequestHandler } from "express";
import notesModel from "../models/notesmodel";
import getDataUri from "../utils/dataUri";
import cloudinary from "cloudinary";
const uploadNote = async (req: any, res: any) => {
  try {
    const file = req.file;
    console.log(file);
    const uri = getDataUri(file);
    const uploaded = await cloudinary.v2.uploader.upload(uri.content);
    console.log(uploaded.bytes);
    const newFile = await notesModel.create({
      name: req.body.name,
      uploadedBy: req.body.uploadedBy,
      size: (uploaded.bytes / 1024) * 1024,
      url: uploaded.secure_url,
    });
    console.log(uploaded.secure_url);
    res.status(200).send("uploaded");
  } catch (err) {
    res.status(400).json({ err });
    console.log(err);
  }
};
export { uploadNote };
