import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import connectToDB from "@/db";
import Institute from "@/models/Institute";
import User from "@/models/User";

const SECRETKEY = new TextEncoder().encode(process.env.JWT_SECRET || "myinventorysecret");

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, SECRETKEY);
    const userId = payload.userId as string;

    await connectToDB();

    const user = await User.findById(userId).populate("institute").lean();
    if (!user || !user.institute) {
      return NextResponse.json({ message: "User or institute not found" }, { status: 404 });
    }

    const instituteId = (user.institute as { _id: string })._id;

    const body = await req.json();
    const { salesAccount, salesCostAccount, returnAccount } = body;

    const updateData: Record<string, unknown> = {};
    if (salesAccount !== undefined) updateData.salesAccount = salesAccount;
    if (salesCostAccount !== undefined) updateData.salesCostAccount = salesCostAccount;
    if (returnAccount !== undefined) updateData.returnAccount = returnAccount;

    const updated = await Institute.findByIdAndUpdate(instituteId, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ message: "Institute not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating default accounts:", error);
    return NextResponse.json({ message: "Failed to update default accounts" }, { status: 500 });
  }
}
