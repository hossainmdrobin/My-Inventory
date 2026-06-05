import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/db";
import Purchase from "@/models/Purchase";

type Context = {
  params: Promise<{ id: string }>;
};

/* ---------------- GET SINGLE PURCHASE ---------------- */
export async function GET(
  _: NextRequest,
  context: Context
) {
  const { id } = await context.params;
  await connectToDB();

  const purchase = await Purchase.findById(id)
    .populate("supplierId", "name")
    .populate("items.productId", "name sku")
    .populate("createdBy", "email")
    .lean();

  if (!purchase) {
    return NextResponse.json(
      { error: "Purchase not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(purchase);
}

/* ---------------- UPDATE PURCHASE ---------------- */
export async function PUT(
  req: NextRequest,
  context: Context
) {
  const { id } = await context.params;
  await connectToDB();

  const body = await req.json();

  const updated = await Purchase.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true }
  );

  if (!updated) {
    return NextResponse.json(
      { error: "Purchase not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

/* ---------------- DELETE PURCHASE ---------------- */
export async function DELETE(
  _: NextRequest,
  context: Context
) {
  const { id } = await context.params;
  await connectToDB();

  const deleted = await Purchase.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json(
      { error: "Purchase not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Purchase deleted" });
}