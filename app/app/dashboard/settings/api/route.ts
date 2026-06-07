import { NextResponse } from "next/server";
import Institute from "@/models/Institute";
import connectToDB from "@/db";

export async function POST(req: Request) {
    try {
        await connectToDB();
        const body = await req.json();
        const institute = await Institute.create(body);
        return NextResponse.json(institute, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function GET() {
    try {
        await connectToDB();
        const institutes = await Institute.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json(institutes);
    } catch {
        return NextResponse.json({ error: "Failed to fetch institutes" }, { status: 500 });
    }
}
