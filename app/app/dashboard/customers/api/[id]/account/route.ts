import { NextRequest, NextResponse } from "next/server";
import connectDB, { connectToDB } from "@/db";
import Customer from "@/models/Customer";
import CustomerLedger from "@/models/CustomerLedger";


type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest,
  context: Context
) {
  const { id } = await context.params;
  await connectToDB();

  const customer = await Customer.findById(id);
  const ledger = await CustomerLedger.find({ customerId:id })
    .sort({ createdAt: -1 });

  return NextResponse.json({
    customer,
    ledger,
  });
}