export interface DashboardReport {
  totalProducts: number;
  totalCostValue: number;
  totalSellingValue: number;
  lowStockItems: number;
}

export interface PurchaseReport {
  totalPurchaseAmount: number;
  totalPaidAmount: number;
  totalUnpaidAmount: number;
  totalPurchases: number;
}

export interface SalesReport {
  totalSaleAmount: number;
  totalPaidAmount: number;
  totalUnpaidAmount: number;
  totalSales: number;
}

export interface AllReports {
  productReport: DashboardReport, saleReport: SalesReport, purchaseReport: PurchaseReport
}