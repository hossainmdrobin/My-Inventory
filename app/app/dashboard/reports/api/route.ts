import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectToDB from "@/db";
import Sale from "@/models/Sale";
import Purchase from "@/models/Purchase";

export async function GET() {
  await connectToDB()
  const LOW_STOCK_LIMIT = 5;

  const stats = await Product.aggregate([
    {
      $facet: {
        totalProducts: [
          {
            $count: "count",
          },
        ],

        totalCostValue: [
          {
            $group: {
              _id: null,
              total: {
                $sum: { $multiply: ["$stock", "$costPrice"] },
              },
            },
          },
        ],

        totalSellingValue: [
          {
            $group: {
              _id: null,
              total: {
                $sum: { $multiply: ["$stock", "$sellingPrice"] },
              },
            },
          },
        ],

        lowStockItems: [
          {
            $match: {
              stock: { $lte: LOW_STOCK_LIMIT },
            },
          },
          {
            $count: "count",
          },
        ],
      },
    },
  ]);
  const saleResult = await Sale.aggregate([
    {
      $group: {
        _id: null,
        totalSaleAmount: { $sum: "$totalPrice" },
        totalPaidAmount: { $sum: "$paid" },
        totalUnpaidAmount: { $sum: "$due" },
        totalSales: { $count: {} },
      },
    },
  ]);
  const purchaseResult = await Purchase.aggregate([
    {
      $group: {
        _id: null,
        totalPurchaseAmount: { $sum: "$totalPrice" },
        totalPaidAmount: { $sum: "$paid" },
        totalUnpaidAmount: { $sum: "$due" },
        totalPurchases: { $count: {} },
      },
    },
  ]);

  const productReport = {
    totalProducts: stats[0].totalProducts[0]?.count || 0,
    totalCostValue: stats[0].totalCostValue[0]?.total || 0,
    totalSellingValue: stats[0].totalSellingValue[0]?.total || 0,
    lowStockItems: stats[0].lowStockItems[0]?.count || 0,
  };
  const saleReport = saleResult[0] || {
    totalSaleAmount: 0,
    totalPaidAmount: 0,
    totalUnpaidAmount: 0,
    totalSales: 0,
  };
  const purchaseReport = purchaseResult[0] || {
    totalPurchaseAmount: 0,
    totalPaidAmount: 0,
    totalUnpaidAmount: 0,
    totalPurchases: 0,
  };
  return NextResponse.json({ productReport, saleReport, purchaseReport });
}