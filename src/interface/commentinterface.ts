import { Document } from "mongoose";
export interface commentinterface extends Document {
  user: String;
  content: String;
}
