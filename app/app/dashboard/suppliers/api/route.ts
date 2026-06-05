import { NextResponse } from "next/server";
import Supplier from "@/models/Supplier";
import connectToDB from "@/db";

/* ---------------- CREATE SUPPLIER ---------------- */
export async function POST(req: Request) {
    try {
        await connectToDB();
        const body = await req.json();

        const supplier = await Supplier.create(body);

        return NextResponse.json(supplier, { status: 201 });
    } catch (error: any) {
        console.log(error)
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        );
    }
}

/* ---------------- READ ALL SUPPLIERS ---------------- */
export async function GET() {
    try {
        await connectToDB();

        const suppliers = await Supplier.find()
            .populate("addedBy", "email")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(suppliers);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch suppliers" },
            { status: 500 }
        );
    }
}
