import { NextRequest, NextResponse } from "next/server";
import Bank from "@/models/Wallet";
import connectToDB from "@/db";

type Context = {
  params: Promise<{ id: string }>;
};

/* ---------------- GET SINGLE BANK ACCOUNT ---------------- */
export async function GET(
  _: NextRequest,
  context: Context
) {
  const { id } = await context.params;
  await connectToDB();

  const bank = await Bank.findById(id).lean();

  if (!bank) {
    return NextResponse.json(
      { error: "Bank account not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(bank);
}

/* ---------------- UPDATE BANK ACCOUNT ---------------- */
export async function PUT(
  req: NextRequest,
  context: Context
) {
  const { id } = await context.params;
  await connectToDB();

  const body = await req.json();

  const updated = await Bank.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true }
  );

  if (!updated) {
    return NextResponse.json(
      { error: "Bank account not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

/* ---------------- DELETE BANK ACCOUNT ---------------- */
export async function DELETE(
  _: NextRequest,
  context: Context
) {
  const { id } = await context.params;
  await connectToDB();

  const deleted = await Bank.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json(
      { error: "Bank account not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Bank account deleted" });
}