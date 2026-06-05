import { NextRequest, NextResponse } from "next/server";
import Supplier from "@/models/Supplier";
import connectToDB from "@/db";

type Context = {
  params: Promise<{ id: string }>;
};

/* ---------------- GET SINGLE SUPPLIER ---------------- */
export async function GET(
  _: NextRequest,
  context: Context
) {
  const { id } = await context.params;
  await connectToDB();

  const supplier = await Supplier.findById(id)
    .populate("addedBy", "email")
    .lean();

  if (!supplier) {
    return NextResponse.json(
      { error: "Supplier not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(supplier);
}

/* ---------------- UPDATE SUPPLIER ---------------- */
export async function PUT(
  req: NextRequest,
  context: Context
) {
  const { id } = await context.params;
  await connectToDB();

  const body = await req.json();

  const updated = await Supplier.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true }
  );

  if (!updated) {
    return NextResponse.json(
      { error: "Supplier not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

/* ---------------- DELETE SUPPLIER ---------------- */
export async function DELETE(
  _: NextRequest,
  context: Context
) {
  const { id } = await context.params;
  await connectToDB();

  const deleted = await Supplier.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json(
      { error: "Supplier not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Supplier deleted" });
}