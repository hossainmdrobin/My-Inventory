import { NextRequest, NextResponse } from "next/server";
import Sale from "@/models/Sale";
import connectToDB from "@/db";

type Context = {
  params: Promise<{ id: string }>;
};

/* ---------------- GET SINGLE SALE ---------------- */
export async function GET(
  _: NextRequest,
  context: Context
) {
  const { id } = await context.params;
  await connectToDB();

  const sale = await Sale.findById(id)
    .populate("customerId", "name phone")
    .populate("items.productId", "name sku")
    .populate("createdBy", "email")
    .lean();

  if (!sale) {
    return NextResponse.json(
      { error: "Sale not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(sale);
}

/* ---------------- UPDATE SALE ---------------- */
export async function PUT(
  req: NextRequest,
  context: Context
) {
  const { id } = await context.params;
  await connectToDB();

  const body = await req.json();

  const updated = await Sale.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true }
  );

  if (!updated) {
    return NextResponse.json(
      { error: "Sale not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

/* ---------------- DELETE SALE ---------------- */
export async function DELETE(
  _: NextRequest,
  context: Context
) {
  const { id } = await context.params;
  await connectToDB();

  const deleted = await Sale.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json(
      { error: "Sale not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Sale deleted" });
}