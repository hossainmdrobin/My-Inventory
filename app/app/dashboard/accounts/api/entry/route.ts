import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/db";
import JournalEntryLine, { IJournalEntryLine } from "@/models/Entry";

export async function GET() {
    await connectToDB();
    try {
        const entries = await JournalEntryLine.find().populate("account").sort({ createdAt: -1 });
        return NextResponse.json(entries , { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await connectToDB();
    try {
        const body: IJournalEntryLine = await req.json();
        const entry = await JournalEntryLine.create(body);
        // const populatedEntry = await entry.populate("Wallet");
        return NextResponse.json({ data: entry }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    await connectToDB();
    try {
        const body = await req.json();
        const { id, ...updateData } = body;
        if (!id) {
            return NextResponse.json({ error: "Entry ID is required" }, { status: 400 });
        }
        const entry = await JournalEntryLine.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).populate("account");
        if (!entry) {
            return NextResponse.json({ error: "Entry not found" }, { status: 404 });
        }
        return NextResponse.json({ data: entry }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    await connectToDB();
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Entry ID is required" }, { status: 400 });
        }
        const entry = await JournalEntryLine.findByIdAndDelete(id);
        if (!entry) {
            return NextResponse.json({ error: "Entry not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Entry deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
