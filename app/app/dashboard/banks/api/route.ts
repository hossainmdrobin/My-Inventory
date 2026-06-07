import { NextResponse } from "next/server";
import Bank from "@/models/Bank";
import connectToDB from "@/db";

/* ---------------- CREATE BANK ACCOUNT ---------------- */
export async function POST(req: Request) {
    try {
        await connectToDB();
        const body = await req.json();

        const bank = await Bank.create(body);

        return NextResponse.json(bank, { status: 201 });
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 }
        );
    }
}

/* ---------------- READ ALL BANK ACCOUNTS ---------------- */
export async function GET() {
    try {
        await connectToDB();

        const banks = await Bank.find()
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(banks);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch bank accounts" },
            { status: 500 }
        );
    }
}