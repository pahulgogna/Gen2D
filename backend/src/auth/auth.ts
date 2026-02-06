import jwt from "jsonwebtoken";
import { JwtUserPayload } from "../types";
import { Env } from "../config/config";
import express from "express";
const expireTime = "7d";

function CreateLoginToken(payload: JwtUserPayload): string {
  return jwt.sign(payload, Env.JwtSecret, { expiresIn: expireTime, algorithm: "HS256" });
}

function JwtVerificationMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  let token = req.header("Authorization");
  if (!token) {
    permissionDenied(res)
    return;
  }
  try {
    var decoded = jwt.verify(token, Env.JwtSecret, {algorithms: ["HS256"]});
    res.locals.user = decoded
  } catch (e) {
    console.log(e)
    permissionDenied(res)
    return
  }
  next();
}

function permissionDenied(res: express.Response) {
    res.status(401).json("permission denied")
}

export { CreateLoginToken, JwtVerificationMiddleware };
