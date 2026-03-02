import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db";
import Customer from "@/models/Customer";

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  console.log(body, "request.body")
  const customer = await Customer.create(body);
  return NextResponse.json(customer);
}


export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  /* =============================
     Query Params
  ============================= */
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";

  const skip = (page - 1) * limit;

  /* =============================
     Search Filter
  ============================= */
  const filter = search
    ? {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ],
    }
    : {};

  /* =============================
     Query DB
  ============================= */
  const [customers, total] = await Promise.all([
    Customer.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Customer.countDocuments(filter),
  ]);

  /* =============================
     Response
  ============================= */
  return NextResponse.json({
    data: customers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}