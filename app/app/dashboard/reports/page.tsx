"use client";
import { useGetDashboardReportQuery } from "@/redux/slices/report/api.report";
import { useState } from "react";
import StockReport from "./StockReport";
import SaleReport from "./SaleReport";
import PurchaseReport from "./PurchaseReport";
import SkeletonTable from "@/reusable/skeletone";
import ErrorCartoonRobot from "@/reusable/ErrorState";

type Tab = "stock" | "sales" | "purchase";

/* ----------------- Page ----------------- */
export default function ReportsPage() {
  const { data: report, isLoading, error } = useGetDashboardReportQuery();
  const [activeTab, setActiveTab] = useState<Tab>("purchase");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Reports</h1>

      {/* Tabs */}
      <div className="flex gap-2">
        <TabBtn label="Stock Summary" active={activeTab === "stock"} onClick={() => setActiveTab("stock")} />
        <TabBtn label="Sales Report" active={activeTab === "sales"} onClick={() => setActiveTab("sales")} />
        <TabBtn label="Purchase History" active={activeTab === "purchase"} onClick={() => setActiveTab("purchase")} />
      </div>

      {isLoading && <SkeletonTable />}
      {error && <ErrorCartoonRobot />}

      {/* Tab content */}
      {activeTab === "stock" && report && (
        <StockReport {...report?.productReport} />
      )}

      {activeTab === "sales" && report && (
        <SaleReport {...report?.saleReport} />
      )}

      {activeTab === "purchase" && report && (
        <PurchaseReport {...report?.purchaseReport} />
      )}
    </div>
  );
}

/* ----------------- Small subcomponents ----------------- */
function TabBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-t-lg -mb-px border-b-2 ${active ? "border-blue-600 text-blue-600 bg-slate-900" : "border-transparent text-slate-400 bg-transparent"
        }`}
    >
      {label}
    </button>
  );
}


// function StatusBadge({ status }: { status: string }) {
//   let cls = "bg-slate-700/40 text-slate-200";
//   if (status === "Paid" || status === "OK") cls = "bg-green-500/20 text-green-400";
//   if (status === "Pending") cls = "bg-yellow-500/20 text-yellow-400";
//   if (status === "Due" || status === "Out of Stock" || status === "Low") cls = "bg-red-500/20 text-red-400";
//   return <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>{status}</span>;
// }
