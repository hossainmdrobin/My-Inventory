import { NextResponse } from "next/server";
import connectDB from "@/db";
import Customer from "@/models/Customer";
import CustomerLedger from "@/models/CustomerLedger";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();

  const customer = await Customer.findById(params.id);
  const ledger = await CustomerLedger.find({ customerId: params.id })
    .sort({ createdAt: -1 });

  return NextResponse.json({
    customer,
    ledger,
  });
}