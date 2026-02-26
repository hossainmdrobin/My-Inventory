import { NextResponse } from "next/server";
import Sale from "@/models/Sale";
import connectToDB from "@/db";
import Purchase from "@/models/Purchase";
import Product from "@/models/Product";
import Supplier from "@/models/Supplier";

export async function GET() {
    await connectToDB();

    const sale = await Sale.aggregate([
        {
            $group: {
                _id: null,
                totalDue: { $sum: "$due" },
            },
        },
    ]);
    const purchase = await Purchase.aggregate([
        {
            $group: {
                _id: null,
                totalDue: { $sum: "$due" },
            },
        },
    ]);
    const totalProducts = await Product.countDocuments()
    const totalSuppliers = await Supplier.countDocuments();
    const totalSale = await Sale.countDocuments()

    const accountReceivable = sale.length > 0 ? sale[0].totalDue : 0;
    const accountPayable = purchase.length > 0 ? purchase[0].totalDue : 0


    return NextResponse.json({ accountPayable, accountReceivable, totalProducts, totalSale, totalSuppliers });
}