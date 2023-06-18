import { NextFunction } from "express";
import JWT from "jsonwebtoken";
import conversationmodel from "../models/conversationmodel";
const canViewMessage = async (req: any, res: any, next: NextFunction) => {
  try {
    const authheaders = req.headers.authorization;
    if (authheaders) {
      var jwt = authheaders.split(" ")[1];
    }
    if (!jwt) return res.status(400).json({ err: "provide jwt" });
    JWT.verify(
      jwt,
      "jfjfjadklfjdskjfkdjfJkjkJKLJK45049DKLSC",
      async (err: JWT.VerifyErrors | null, user: any) => {
        if (err) {
          res.status(400).send("invalid jwt");
        } else {
          const convo = await conversationmodel
            .findOne({ _id: req.params.id })
            .select("users");
          if (convo?.users.includes(user.id)) {
            return next();
          }
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};
export default canViewMessage;
