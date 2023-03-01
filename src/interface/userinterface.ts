import { Document } from "mongoose";
export interface userinterface extends Document {
  username: string;
  firstName: string;
  lastName: string;
  gender: string;
  password: string;
  followers: {
    type: Array<userinterface>;
  };
  following: {
    type: Array<userinterface>;
  };
}
