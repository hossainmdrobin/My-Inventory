import { NextRequest, NextResponse } from "next/server";
import { Employee } from "@/models/Employee";
import connectToDB from "@/db";


// ---------------- GET ALL EMPLOYEES ----------------
export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role");
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    const query: any = {};

    // Search by name, phone, email (case-insensitive)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) query.role = role;
    if (status) query.status = status;

    const total = await Employee.countDocuments(query);

    const employees = await Employee.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      data: employees,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}


// ---------------- CREATE EMPLOYEE ----------------
export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body = await req.json();
    console.log(body)

    const employee = await Employee.create(body);

    return NextResponse.json(employee, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create employee" },
      { status: 400 }
    );
  }
}