import { NextResponse } from "next/server";
import Purchase from "@/models/Purchase";
import connectToDB from "@/db";

/* ---------------- CREATE PURCHASE ---------------- */
export async function POST(req: Request) {
    try {
        await connectToDB();
        const body = await req.json();

        const purchase = await Purchase.create(body);

        return NextResponse.json(purchase, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        );
    }
}

/* ---------------- READ ALL PURCHASES ---------------- */
export async function GET() {
    try {
        await connectToDB();

        const purchases = await Purchase.find()
            .populate("supplierId", "name")
            .populate("items.productId", "name sku")
            .populate("createdBy", "email")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(purchases);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch purchases" },
            { status: 500 }
        );
    }
}
