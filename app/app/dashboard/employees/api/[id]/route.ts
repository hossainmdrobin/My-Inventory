import { NextRequest, NextResponse } from "next/server";
import { Employee } from "@/models/Employee";
import connectToDB from "@/db";
type Context = {
  params: Promise<{ id: string }>;
};

// ---------------- GET SINGLE EMPLOYEE ----------------
export async function GET(_: NextRequest,
  context: Context
) {
  try {
    const { id } = await context.params;

    const employee = await Employee.findById(id);

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch employee" },
      { status: 500 }
    );
  }
}


// ---------------- UPDATE EMPLOYEE ----------------
export async function PATCH(req: NextRequest,
  context: Context
) {
  try {
    const { id } = await context.params;
    await connectToDB();
    const body = await req.json();


    const employee = await Employee.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update employee" },
      { status: 400 }
    );
  }
}


// ---------------- DELETE EMPLOYEE ----------------
export async function DELETE(
  req: NextRequest,
  context: Context
) {
  try {
    const { id } = await context.params;
    await connectToDB();

    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Employee deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete employee" },
      { status: 500 }
    );
  }
}