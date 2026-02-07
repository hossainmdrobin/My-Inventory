import { NextResponse } from "next/server";
import connectToDB from "@/db";
import Purchase from "@/models/Purchase";

/* ---------------- GET SINGLE PURCHASE ---------------- */
export async function GET(
    _: Request,
    { params }: { params: { id: string } }
) {
    await connectToDB();

    const purchase = await Purchase.findById(params.id)
        .populate("supplierId", "name")
        .populate("items.productId", "name sku")
        .populate("createdBy", "email")
        .lean();

    if (!purchase) {
        return NextResponse.json(
            { error: "Purchase not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(purchase);
}

/* ---------------- UPDATE PURCHASE ---------------- */
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
        await connectToDB();
    const body = await req.json();

    const updated = await Purchase.findByIdAndUpdate(
        params.id,
        body,
        { new: true, runValidators: true }
    );

    if (!updated) {
        return NextResponse.json(
            { error: "Purchase not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(updated);
}

/* ---------------- DELETE PURCHASE ---------------- */
export async function DELETE(
    _: Request,
    { params }: { params: { id: string } }
) {
    await connectToDB();

    const deleted = await Purchase.findByIdAndDelete(params.id);

    if (!deleted) {
        return NextResponse.json(
            { error: "Purchase not found" },
            { status: 404 }
        );
    }

    return NextResponse.json({ message: "Purchase deleted" });
}
