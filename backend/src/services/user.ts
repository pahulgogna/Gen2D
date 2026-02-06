import express from "express";
import { SendJsonError, SendJsonResponse } from "../utils/utils";
import { UserModel } from "../database/database";
import { CreateUserRequest, UserLoginRequest } from "../utils/validations";
import bcrypt from "bcrypt";
import { Env } from "../config/config";
import { CreateLoginToken, JwtVerificationMiddleware } from "../auth/auth";
import { JwtUserPayload } from "../types";

const userRouter = express.Router();

userRouter.get("/", JwtVerificationMiddleware, async (req, res) => {
  let jwtUser: JwtUserPayload = res.locals.user;

  try {
    let dbuser = await UserModel.findById(jwtUser.id, {
      _id: true,
      name: true,
      email: true,
    });
    if (!dbuser) {
      SendJsonError(res, 404, "user not found");
      return;
    }

    SendJsonResponse(res, 200, dbuser);
  } catch {
    SendJsonError(res, 500, "")
  }
});

userRouter.use(express.json());

userRouter.post("/register", async (req, res) => {
  let reqUser = CreateUserRequest.safeParse(req.body);
  if (!reqUser.success) {
    SendJsonError(res, 400, reqUser.error.message);
    return;
  }

  try {
    let salt = await bcrypt.genSalt(Env.SaltRounds);
    let hashedPassword = await bcrypt.hash(reqUser.data.password, salt);
    reqUser.data.password = hashedPassword;

    await UserModel.insertOne(reqUser.data);
  } catch (e) {
    SendJsonError(res, 400, e);
    return;
  }
  SendJsonResponse(res, 200, { message: "user created successfully" });
});

userRouter.post("/login", async (req, res) => {
  let reqUser = UserLoginRequest.safeParse(req.body);
  if (reqUser.success == false) {
    SendJsonError(res, 400, "invalid credentials");
    return;
  }

  try {
    let dbUser = await UserModel.findOne({
      email: reqUser.data.email,
    });
    if (!dbUser) {
      SendJsonError(res, 404, "user not found");
      return;
    }

    let passwordCheck = await bcrypt.compare(
      reqUser.data.password,
      dbUser.password,
    );
    if (!passwordCheck) {
      SendJsonError(res, 400, "invalid credentials");
      return;
    }

    let token = CreateLoginToken({
      id: dbUser._id.toString(),
      email: dbUser.email,
    });

    SendJsonResponse(res, 200, { token: token });
  } catch (e) {
    console.error(e);
    SendJsonError(res, 500, e);
  }
});

export { userRouter };
