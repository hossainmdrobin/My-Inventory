import { NextResponse } from "next/server";
import Sale from "@/models/Sale";
import connectToDB from "@/db";

/* ---------------- GET SINGLE SALE ---------------- */
export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectToDB();

  const sale = await Sale.findById(params.id)
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
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectToDB();
  const body = await req.json();

  const updated = await Sale.findByIdAndUpdate(
    params.id,
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
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectToDB();

  const deleted = await Sale.findByIdAndDelete(params.id);

  if (!deleted) {
    return NextResponse.json(
      { error: "Sale not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Sale deleted" });
}
