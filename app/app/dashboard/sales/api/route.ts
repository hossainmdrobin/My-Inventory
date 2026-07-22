import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/db";
import "@/models/Product"
import Sale from "@/models/Sale";

/* ---------------- CREATE SALE ---------------- */
export async function POST(req: Request) {
    try {
        await connectToDB();
        const body = await req.json();
        const sale = new Sale(body);
        await sale.save();
        return NextResponse.json(sale, { status: 200 });
    } catch (error: any) {
        console.error("Error creating sale:", error);
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

        if(searchParams.get("status")){
            if(searchParams.get("status") === "due"){
                query.due = { $gt: 0 }
            } else if(searchParams.get("status") === "paid"){
                query.due = 0
            }
        }

        // 📅 Date range filter
        if (startDate || endDate) {
            query.date = {};

            if (startDate) {
                query.date.$gte = new Date(startDate);
            }

            if (endDate) {
                // include full end day
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.date.$lte = end;
            }
        }
        const total = await Sale.countDocuments(query);
        const sales = await Sale.find(query)
            .limit(limit)
            .skip((page - 1) * limit)
            .populate("items.productId", "name sku")
            .populate("createdBy", "email")
            .sort({ date: -1 })
            .lean();

        return NextResponse.json({
            data: sales,
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

/* ---------------- UPDATE SALE ---------------- */
export async function PATCH(req: Request) {
    try {
        await connectToDB();
        const body = await req.json();
        const { id, data } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Sale id is required" },
                { status: 400 }
            );
        }

        const existing = await Sale.findById(id);
        if (!existing) {
            return NextResponse.json(
                { error: "Sale not found" },
                { status: 404 }
            );
        }

        // Recalculate derived fields when items or payment change
        const updateData: any = { ...data };

        if (Array.isArray(updateData.items)) {
            updateData.items = updateData.items.map((item: any) => ({
                institute: item.institute,
                supplier: item.supplier,
                name: item.name,
                date: item.date,
                productId: item.productId,
                detailQuantity: item.detailQuantity || [],
                quantity: Number(item.quantity) || 0,
                costPrice: Number(item.costPrice) || 0,
                sellingPrice: Number(item.sellingPrice) || 0,
                totalPrice: Number(item.totalPrice) || 0,
                comission: Number(item.comission) || 0,
            }));

            updateData.totalPrice = updateData.items.reduce(
                (sum: number, item: any) =>
                    sum + (Number(item.sellingPrice) || 0) * (Number(item.quantity) || 0),
                0
            );
        }

        if (typeof updateData.paid === "number") {
            updateData.due = Math.max(
                (updateData.totalPrice ?? existing.totalPrice) - updateData.paid,
                0
            );
        }

        const updated = await Sale.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        )
            .populate("items.productId", "name sku")
            .populate("createdBy", "email")
            .lean();

        return NextResponse.json(updated, { status: 200 });
    } catch (error: any) {
        console.error("Error updating sale:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        );
    }
}

/* ---------------- DELETE SALE ---------------- */
export async function DELETE(req: Request) {
    try {
        await connectToDB();
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Sale id is required" },
                { status: 400 }
            );
        }

        const deleted = await Sale.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json(
                { error: "Sale not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Sale deleted", _id: id },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error deleting sale:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        );
    }
}