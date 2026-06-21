import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/db";
import Transaction from "@/models/Transaction";
import Wallet from "@/models/Wallet";
import JournalEntryLine from "@/models/Entry";
import { jwtVerify } from "jose";
const SECRETKEY = new TextEncoder().encode(process.env.JWT_SECRET || "myinventorysecret");

export async function POST(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
    }

    try {

        const { payload } = await jwtVerify(token, SECRETKEY);
        const userId = payload.userId as string;

        await connectToDB();

        const body = await request.json();
        const { amount, source, sourceWallet, sourceSupplier, destinationWallet, destinationSupplier, note } = body;
        if (!sourceWallet || !destinationWallet) {
            return NextResponse.json({ error: "Destination and source are required" }, { status: 400 });
        }
        // DECRESS FROM SOURCE WALLET
        if (sourceWallet) {
            const wallet = await Wallet.findByIdAndUpdate(sourceWallet, { $inc: { balance: -amount } }, { new: true });
            const entry = new JournalEntryLine({user:userId, amount: amount, newBalance: wallet?.balance, description: "Transaction", type: "debit", account: sourceWallet })
            await entry.save()
        }
        // INCREASE FROM DESTINATION WALLET
        if (sourceWallet) {
            const wallet = await Wallet.findByIdAndUpdate(destinationWallet, { $inc: { balance: amount } }, { new: true });
            const entry = new JournalEntryLine({user:userId, amount: amount, newBalance: wallet?.balance, description: "Transaction", type: "credit", account: destinationWallet })
            await entry.save()
        }

        const data: Record<string, unknown> = { amount, source };

        if (sourceWallet) data.sourceWallet = sourceWallet;
        if (sourceSupplier) data.sourceSupplier = sourceSupplier;
        if (destinationWallet) data.destinationWallet = destinationWallet;
        if (destinationSupplier) data.destinationSupplier = destinationSupplier;
        if (note) data.note = note;

        const transaction = await Transaction.create(data);
        return NextResponse.json(transaction, { status: 201 });
    } catch (error) {
        console.error("Error creating transaction:", error);
        return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
    }
}