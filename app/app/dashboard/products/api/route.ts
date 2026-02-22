import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import { connectToDB } from "@/db";
import "@/models/Supplier";
import { skip } from "node:test";

/* -------------------- CREATE PRODUCT -------------------- */
export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.log("Error creating product:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

/* -------------------- READ ALL PRODUCTS -------------------- */
export async function GET(req:NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const key = searchParams.get("key") || "";
  try {
    await connectToDB();
    const products = await Product.find({name:{$regex:key, $options:"i"}}).sort({ createdAt: -1 }).lean().populate("supplier").limit(limit).skip((page - 1) * limit)
    return NextResponse.json(products);
  } catch(e) {
    console.log("Error fetching products:", e);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
