"use server";

import { UserModel } from "@/lib/models/models";
import { createLoginToken, HashPassword, verifyJWT } from "./auth/auth";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import { DBUser } from "@/lib/types";

export async function GetUser(): Promise<DBUser> {
  let user = await verifyJWT();
  if (!user) {
    console.log("jwt not found");
    redirect("/auth/signin");
  }

  await dbConnect();
  try {
    let dbuser = await UserModel.findById(user.id, {
      _id: true,
      name: true,
      email: true,
    });
    if (!dbuser) {
      console.log("user not found");
      redirect("/auth/signup");
    }

    return {
      id: dbuser.id,
      email: dbuser.email,
      name: dbuser.name,
    };
  } catch (e) {
    console.log("error: " + e);
    redirect("/auth/signin");
  }
}

export async function Login(_: string, formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return "both email and password are required";
  }

  let mongoose = await dbConnect();

  try {
    let dbUser = await UserModel.findOne({
      email: email,
    });
    if (!dbUser) {
      return "user not found";
    }

    let passwordCheck = await bcrypt.compare(password, dbUser.password);
    if (!passwordCheck) {
      return "invalid credentials";
    }

    let token = await createLoginToken({
      id: dbUser._id.toString(),
      email: dbUser.email,
    });

    (await cookies()).set("token", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      httpOnly: true,
      sameSite: "lax",
    });

    redirect("/c");
  } catch (e) {
    if ((e as any)?.digest?.startsWith("NEXT_REDIRECT")) {
      throw e;
    }
    console.error(e);
    return "error while signin you in";
  }
}

export async function SignupUser(_: string,formData: FormData) {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !email || !password) {
    return "invalid payload";
  }
  try {
    let hashedPassword = await HashPassword(password);

    await dbConnect()

    await UserModel.insertOne({
      name: name,
      email: email,
      password: hashedPassword,
    });
  } catch (e) {
    return "this email already taken";
  }
  return "";
}

export async function Logout() {
  (await cookies()).delete("token");
  return "logged out";
}
