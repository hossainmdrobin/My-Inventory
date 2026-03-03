import { NextRequest, NextResponse } from "next/server";
import Customer from "@/models/Customer";
import connectToDB from "@/db";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  req: NextRequest,
  context: Context
) {
  const { id } = await context.params;
  await connectToDB();
  const body = await req.json();

  const updated = await Customer.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(
  _: NextRequest,
  context: Context
) {
  const { id } = await context.params;
  await connectToDB();
  await Customer.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}