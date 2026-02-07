import { NextResponse } from "next/server";
import Supplier from "@/models/Supplier";
import connectToDB from "@/db";

/* ---------------- GET SINGLE SUPPLIER ---------------- */
export async function GET(
    _: Request,
    { params }: { params: { id: string } }
) {
    await connectToDB();

    const supplier = await Supplier.findById(params.id)
        .populate("addedBy", "email")
        .lean();

    if (!supplier) {
        return NextResponse.json(
            { error: "Supplier not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(supplier);
}

/* ---------------- UPDATE SUPPLIER ---------------- */
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    await connectToDB();
    const body = await req.json();

    const updated = await Supplier.findByIdAndUpdate(
        params.id,
        body,
        { new: true, runValidators: true }
    );

    if (!updated) {
        return NextResponse.json(
            { error: "Supplier not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(updated);
}

/* ---------------- DELETE SUPPLIER ---------------- */
export async function DELETE(
    _: Request,
    { params }: { params: { id: string } }
) {
    await connectToDB();

    const deleted = await Supplier.findByIdAndDelete(params.id);

    if (!deleted) {
        return NextResponse.json(
            { error: "Supplier not found" },
            { status: 404 }
        );
    }

    return NextResponse.json({ message: "Supplier deleted" });
}
