import { NextResponse } from "next/server";
import Supplier from "@/models/Supplier";
import connectToDB from "@/db";

/* ---------------- GET SINGLE SUPPLIER ---------------- */
export async function GET(
    _: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await params
    await connectToDB();

    const supplier = await Supplier.findById(id)
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
    const { id } = await params
    await connectToDB();
    const body = await req.json();
    console.log(body)

    const updated = await Supplier.findByIdAndUpdate(
        id,
        body,
        { new: true, runValidators: true }
    );
    console.log(updated)

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
    const { id } = await params

    await connectToDB();

    const deleted = await Supplier.findByIdAndDelete(id);

    if (!deleted) {
        return NextResponse.json(
            { error: "Supplier not found" },
            { status: 404 }
        );
    }

    return NextResponse.json({ message: "Supplier deleted" });
}
