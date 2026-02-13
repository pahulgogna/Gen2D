import jwt from "jsonwebtoken";
import { JwtUserPayload } from "@/lib/types";
import { Env } from "@/lib/config";
import { cookies } from "next/headers";
import { SendJsonError } from "@/lib/utils/utils";
import bcrypt from "bcrypt"

const expireTime = "7d";

export async function createLoginToken(
  payload: JwtUserPayload,
): Promise<string> {
  return jwt.sign(payload, Env.JwtSecret, {
    expiresIn: expireTime,
    algorithm: "HS256",
  });
}

export async function verifyJWT(): Promise<JwtUserPayload | undefined> {
  let token = (await cookies()).get("token")?.value;
  if (!token) {
    permissionDenied();
    return;
  }
  try {
    var decoded = jwt.verify(token, Env.JwtSecret, { algorithms: ["HS256"] });
    if (!decoded || typeof decoded === "string") {
      permissionDenied();
      return;
    }

    return decoded as JwtUserPayload;
  } catch (e) {
    console.log(e);
    permissionDenied();
  }
}

async function permissionDenied() {
  SendJsonError(401, "permission denied");
}

export async function HashPassword(password: string): Promise<string> {
  let salt = await bcrypt.genSalt(Env.SaltRounds);
  let hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}
