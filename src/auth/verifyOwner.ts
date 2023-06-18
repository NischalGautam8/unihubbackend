import { NextFunction } from "express";
import JWT from "jsonwebtoken";
const verifyOwner = (req: any, res: any, next: NextFunction) => {
  try {
    const { jwt, owner } = req.body;
    if (!jwt) {
      res.status(404).send("no jwt provided");
    }
    JWT.verify(
      jwt,
      "jfjfjadklfjdskjfkdjfJkjkJKLJK45049DKLSC",
      (err: JWT.VerifyErrors | null, user: any) => {
        if (err) {
          res.status(400).send("invalid jwt");
        } else {
          if (user.id == owner) {
            next();
          }
          return res.status(400).send("you are not the author");
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};
export default verifyOwner;
