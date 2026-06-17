import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db";
import JournalEntryLine from "@/models/Entry";

export async function GET(
    req: NextRequest,
    { params }: { params: { accountId: string } }
) {
    await dbConnect();
    try {
        const { accountId } = params;
        const entries = await JournalEntryLine.find({ account: accountId })
            .populate("account")
            .sort({ createdAt: -1 });
        return NextResponse.json({ data: entries }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
