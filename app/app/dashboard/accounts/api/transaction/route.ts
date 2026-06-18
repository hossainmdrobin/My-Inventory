import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/db";
import Transaction from "@/models/Transaction";
import Wallet from "@/models/Wallet";
import { authenticateToken } from "@/actions/authenticateToken";
import JournalEntryLine from "@/models/Entry";

export async function POST(request: NextRequest) {
    const user = await authenticateToken(request)
    if (!user) {
        return NextResponse.json({ success: false, error: "Authentication failed!" })
    }

    const body = await request.json();
    const { amount, source, sourceWallet, sourceSupplier, destinationWallet, destinationSupplier, note } = body;
    if (!sourceWallet || !destinationWallet) {
        return NextResponse.json({ error: "Destination and source are required" }, { status: 400 });
    }
    // DECRESS FROM SOURCE WALLET
    if (sourceWallet) {
        const wallet = await Wallet.findByIdAndUpdate(sourceWallet, { $inc: { balance: -amount } }, { new: true });
        const entry = new JournalEntryLine({ user: user._id, institute: user?.institute?._id, amount: amount, newBalance: wallet?.balance, description: "Transaction", type: "debit", account: sourceWallet })
        await entry.save()
    }
    // INCREASE FROM DESTINATION WALLET
    if (sourceWallet) {
        const wallet = await Wallet.findByIdAndUpdate(destinationWallet, { $inc: { balance: amount } }, { new: true });
        const entry = new JournalEntryLine({ user: user._id, institute: user?.institute?._id, amount: amount, newBalance: wallet?.balance, description: "Transaction", type: "credit", account: destinationWallet })
        await entry.save()
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
