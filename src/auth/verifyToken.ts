import { NextFunction, RequestHandler } from "express";
import JWT, { JwtPayload } from "jsonwebtoken";

const verifyToken: RequestHandler = (
  req: any,
  res: any,
  next: NextFunction
) => {
  try {
    let { jwt } = req.body;
    if (!jwt) {
      const authheaders = req.headers.authorization;
      if (authheaders) {
        jwt = authheaders.split(" ")[1];
      } else {
        return res.status(400).send("no jwt provided");
      }
    }
    JWT.verify(
      jwt,
      process.env.REFRESH_TOKEN_SECRET as string,
      (err: JWT.VerifyErrors | null, user: any) => {
        if (err) {
          console.log(err);
          res.status(400).send("invalid jwt");
        } else {
          next();
        }
      }
    );
  } catch (err) {
    res.status(404).send(err);
  }
};
export { verifyToken };
