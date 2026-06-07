// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import connectToDB from "@/db";
import User from "@/models/User";

const SECRETKEY = new TextEncoder().encode(process.env.JWT_SECRET || "myinventorysecret");

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, SECRETKEY);
    const userId = payload.userId as string;
    await connectToDB();
    const user = await User.findById(userId).select("-password").populate("institute").lean();
    console.log("Authenticated user: ", user);
    return NextResponse.json(user);
  } catch(e) {
    console.error("Error verifying token: ", e);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
