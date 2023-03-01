import { Document } from "mongoose";
export interface postinterface extends Document {
  description: String;
  firstName: String;
  lastName: String;
  userId: String;
  comments: Array<String>;
  likes: Array<String>;
}
