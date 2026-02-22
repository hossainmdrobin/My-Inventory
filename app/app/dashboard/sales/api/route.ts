import { NextRequest, NextResponse } from "next/server";
import Purchase from "@/models/Purchase";
import connectToDB from "@/db";
import "@/models/Product"

/* ---------------- CREATE PURCHASE ---------------- */
export async function POST(req: Request) {
    try {
        await connectToDB();
        const body = await req.json();

        const purchase = await Purchase.create(body);

        return NextResponse.json(purchase, { status: 200 });
    } catch (error: any) {
        console.log("Error creating purchase:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        );
    }
}

/* ---------------- READ ALL PURCHASES ---------------- */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const key = searchParams.get("key") || "";
    try {
        await connectToDB();

        const purchases = await Purchase.find({$or:[{note:{$regex:key, $options:"i"}}, {description:{$regex:key, $options:"i"}}]}).limit(limit).skip((page - 1) * limit)
            .populate("items.productId", "name sku")
            .populate("createdBy", "email")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(purchases);
    } catch(error: any) {
        console.log("Error fetching purchases:", error);
        return NextResponse.json(
            { error: "Failed to fetch purchases" },
            { status: 500 }
        );
    }
}
