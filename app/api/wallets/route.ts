import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import connectToDB from "@/db";
import Wallet from "@/models/Wallet";

const SECRETKEY = new TextEncoder().encode(process.env.JWT_SECRET || "myinventorysecret");

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await jwtVerify(token, SECRETKEY);
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const instituteId = searchParams.get("instituteId");

    if (!instituteId) {
      return NextResponse.json({ message: "instituteId is required" }, { status: 400 });
    }

    const wallets = await Wallet.find({ institute: instituteId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(wallets);
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return NextResponse.json({ message: "Failed to fetch wallets" }, { status: 500 });
  }
}
