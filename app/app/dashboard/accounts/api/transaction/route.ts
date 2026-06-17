import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/db";
import Transaction from "@/models/Transaction";
import Wallet from "@/models/Wallet";

export async function POST(request: Request) {
    const body = await request.json();
    const { amount, source, sourceWallet, sourceSupplier, destinationWallet, destinationSupplier, note } = body;

    if(sourceWallet){
        await Wallet.findByIdAndUpdate(sourceWallet, { $inc: { balance: -amount } }, { new: true });
        const transaction = new Transaction({})
    }

    if (!amount || !source) {
        return NextResponse.json({ error: "amount and source are required" }, { status: 400 });
    }

    const data: Record<string, unknown> = { amount, source };

    if (sourceWallet) data.sourceWallet = sourceWallet;
    if (sourceSupplier) data.sourceSupplier = sourceSupplier;
    if (destinationWallet) data.destinationWallet = destinationWallet;
    if (destinationSupplier) data.destinationSupplier = destinationSupplier;
    if (note) data.note = note;

    try {
        await connectToDB();
        const transaction = await Transaction.create(data);
        return NextResponse.json(transaction, { status: 201 });
    } catch (error) {
        console.error("Error creating transaction:", error);
        return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
    }
}
