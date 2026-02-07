import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { connectToDB } from "@/db";

/* -------------------- CREATE PRODUCT -------------------- */
export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

/* -------------------- READ ALL PRODUCTS -------------------- */
export async function GET() {
  try {
    await connectToDB();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
