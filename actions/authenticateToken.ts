"use server"
// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import connectToDB from "@/db";
import User from "@/models/User";
import { UserRes } from "@/types/userResponse";

const SECRETKEY = new TextEncoder().encode(process.env.JWT_SECRET || "myinventorysecret");

export async function authenticateToken(req: NextRequest):Promise<UserRes> {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    throw new Error("Authentication failed!")
  }

  try {
    const { payload } = await jwtVerify(token, SECRETKEY);
    console.log("consoling payload from me",payload)
    const userId = payload.userId as string;
    await connectToDB();
    const user = await User.findById(userId).select("-password").populate("institute").lean();
    return user
  } catch(e) {
    throw new Error(e instanceof Error ? e.message : String(e))
  }
}
