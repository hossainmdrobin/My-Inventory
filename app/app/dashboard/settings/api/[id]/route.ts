import { NextRequest, NextResponse } from "next/server";
import Institute from "@/models/Institute";
import connectToDB from "@/db";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, context: Context) {
    const { id } = await context.params;
    await connectToDB();
    const institute = await Institute.findById(id).lean();
    if (!institute) return NextResponse.json({ error: "Institute not found" }, { status: 404 });
    return NextResponse.json(institute);
}

export async function PUT(req: NextRequest, context: Context) {
    const { id } = await context.params;
    await connectToDB();
    const body = await req.json();
    const updated = await Institute.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updated) return NextResponse.json({ error: "Institute not found" }, { status: 404 });
    return NextResponse.json(updated);
}

