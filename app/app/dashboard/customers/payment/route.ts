import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db";
import Customer from "@/models/Customer";
import CustomerLedger from "@/models/CustomerLedger";

export async function POST(req: NextRequest) {
  await connectDB();
  const { customerId, amount, note } = await req.json();

  if (!customerId || !amount) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Update account
  await Customer.findByIdAndUpdate(customerId, {
    $inc: {
      totalPaid: amount,
      totalDue: -amount,
    },
  });

  // Add ledger
  await CustomerLedger.create({
    customerId,
    type: "PAYMENT",
    amount,
    note,
  });

  return NextResponse.json({ success: true });
}