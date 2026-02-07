import { NextResponse } from "next/server";
import Sale from "@/models/Sale";
import connectToDB from "@/db";

/* ---------------- CREATE SALE ---------------- */
export async function POST(req: Request) {
    try {
        await connectToDB();
        const body = await req.json();

        const sale = await Sale.create(body);

        return NextResponse.json(sale, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        );
    }
}

/* ---------------- READ ALL SALES ---------------- */
export async function GET() {
    try {
        await connectToDB();

        const sales = await Sale.find()
            .populate("customerId", "name phone")
            .populate("items.productId", "name sku")
            .populate("createdBy", "email")
            .sort({ date: -1 })
            .lean();

        return NextResponse.json(sales);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch sales" },
            { status: 500 }
        );
    }
}
