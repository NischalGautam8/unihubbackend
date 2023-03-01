import usermodel from "../models/usermodel";
import { RequestHandler, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const register: RequestHandler = async (req: Request, res: Response) => {
  try {
    const user = await usermodel.create(
      {
        username: req.body.username,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        email: req.body.email,
        gender: req.body.gender,
        password: await bcrypt.hash(req.body.password, 10),
      },
      { new: true }
    );
    if (!user) {
      res.status(400).json("unable to create user");
    } else {
      res.status(200).json({ user });
    }
  } catch (err) {
    return res.status(400).send({ err: err });
    console.log(err);
  }
};
const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const result = await usermodel.findOne({ username });
  if (!result) {
    return res.status(404).json({ err: "no user found" });
  } else {
    if (!(await bcrypt.compare(password, result.password))) {
      res.status(500).json({ msg: "wrong password" });
    } else {
      const token = jwt.sign(
        { username: username, lastname: result.lastName },
        "secretkey123"
      );
      return res.status(500).json({ token });
    }
  }
};
export { register, login };
