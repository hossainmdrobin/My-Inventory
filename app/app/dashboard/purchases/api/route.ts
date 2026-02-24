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

    // ✅ New: date range params
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    try {
        await connectToDB();

        // 🔎 Build dynamic query
        const query: any = {};

        // Search filter
        if (key) {
            query.$or = [
                { note: { $regex: key, $options: "i" } },
                { description: { $regex: key, $options: "i" } },
            ];
        }

        // 📅 Date range filter
        if (startDate || endDate) {
            query.createdAt = {};

            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }

            if (endDate) {
                // include full end day
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
            }
        }
        const total = await Purchase.countDocuments(query);
        const purchases = await Purchase.find(query)
            .limit(limit)
            .skip((page - 1) * limit)
            .populate("items.productId", "name sku")
            .populate("createdBy", "email")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            data: purchases,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error: any) {
        console.error("Error fetching purchases:", error);
        return NextResponse.json(
            { error: "Failed to fetch purchases" },
            { status: 500 }
        );
    }
}
