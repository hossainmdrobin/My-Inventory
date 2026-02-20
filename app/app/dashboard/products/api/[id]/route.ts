import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectToDB from "@/db";

/* -------------------- GET SINGLE PRODUCT -------------------- */
export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params
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
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params
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
  _: Request,
  { params }: { params: { id: string } }
) {
  const {id} = await params
  await connectToDB();

  const deleted = await Product.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Product deleted successfully" });
}
