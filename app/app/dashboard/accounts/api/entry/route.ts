import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/db";
import JournalEntryLine, { IJournalEntryLine } from "@/models/Entry";
import Wallet from "@/models/Wallet";

export async function GET(req: NextRequest) {
    await connectToDB();
    try {
        const { searchParams } = new URL(req.url);
        const walletId = searchParams.get("wallet_id");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const limit = searchParams.get("limit");

        const filter: Record<string, any> = {};
        if (walletId) {
            filter.account = walletId;
        }
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        let query = JournalEntryLine.find(filter)
            .populate("account")
            .sort({ createdAt: -1 });

        if (limit) {
            query = query.limit(Number(limit));
        }

        const entries = await query;
        return NextResponse.json(entries, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await connectToDB();
    try {
        const body: IJournalEntryLine = await req.json();
        const queryObj = body.type == "debit" ? { balance: body.amount * -1 } : { balance: body.amount }
        const updatedWallet = await Wallet.findByIdAndUpdate(body.account, { $inc: queryObj }, { new: true })
        const entry = await JournalEntryLine.create({ ...body, newBalance: updatedWallet.balance });

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
