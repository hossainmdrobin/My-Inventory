import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import connectToDB from "@/db";

type Context = {
  params: Promise<{ id: string }>;
};

/* -------------------- GET SINGLE PRODUCT -------------------- */
export async function GET(
  _: NextRequest,
  context: Context
) {
  const { id } = await context.params;

  await connectToDB();

  const product = await Product.findById(id).lean();

  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}

/* -------------------- UPDATE PRODUCT -------------------- */
export async function PUT(
  req: NextRequest,
  context: Context
) {
  const { id } = await context.params;
  await connectToDB();

  const body = await req.json();

  const updated = await Product.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true }
  );

  if (!updated) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

/* -------------------- DELETE PRODUCT -------------------- */
export async function DELETE(
  _: NextRequest,
  context: Context
) {
  const { id } = await context.params;
  await connectToDB();

  const deleted = await Product.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Product deleted successfully",
  });
}