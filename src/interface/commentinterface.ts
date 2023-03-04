import { Document } from "mongoose";
import { userinterface } from "./userinterface";
export interface commentinterface extends Document {
  user: string;
  content: string;
  postid: string;
  createdAt: string;
  likes: Array<string>;
}
