import { NextFunction, RequestHandler } from "express";
import JWT, {JwtPayload } from 'jsonwebtoken';

const verifyToken:RequestHandler=(req:any,res:any,next:NextFunction)=>{
try{
    const {jwt}=req.body;
    if(!jwt){
        return res.status(400).send("no jwt provided");
    }
    JWT.verify(jwt, "jfjfjadklfjdskjfkdjfJkjkJKLJK45049DKLSC", (err:JWT.VerifyErrors| null,user:any)=>{
        if(err){
            console.log(err);
            res.status(400).send("invalid jwt")
        }else{
            next();
        }
    })
}catch(err){
    res.status(404).send(err);
}
}
export {verifyToken};