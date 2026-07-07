"use client";

import { useState, useEffect } from "react";
import SaleCart from "./SaleCart";
import { useSelector } from "react-redux";
import SaleTable from "./SaleTable";
import SalesByProductTable from "./SalesByProductTable";
import { useGetSalesQuery } from "@/redux/slices/sales/api.sale";
import PurchaseFilters from "@/reusable/PurchaseAndSaleFilter";
import { FilterValues } from "@/types/others";
import Pagination from "@/reusable/Pagination";
import SkeletonTable from "@/reusable/skeletone";

export default function SalesPage() {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string[]>([]);
  const [pageNo, setPageNo] = useState(1)

  // Calculate current month boundaries dynamically
  const getCurrentMonthRange = (): { startDate: string; endDate: string } => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
    return { startDate, endDate };
  };

  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    startDate: "",
    endDate: "",
    limit: 450,
    status: "",
    dateMode: "month",
    sortBy: "productName",
    sortOrder: "asc",
  });

  // Initialize filters to current month when component mounts
  useEffect(() => {
    const { startDate, endDate } = getCurrentMonthRange();
    setFilters(prev => ({
      ...prev,
      dateMode: "month",
      startDate,
      endDate,
    }));
  }, []);

  const sale = useSelector((state: any) => state.sale);
  const { data, isLoading, error } = useGetSalesQuery({ key: filters.search, range: { startDate: filters.startDate, endDate: filters.endDate }, limit: filters.limit, page: pageNo, status: filters.status });
  console.log(data, isLoading)
  useEffect(() => {
    setSelectedId(sale.items.map((item: any) => item.productId));
  }, [sale]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Sales</h1>

        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          + Add Sale
        </button>
      </div>

      {open && <SaleCart setCartOpen={setOpen} sale={sale} selectedIds={selectedId} />}
      <hr />
      {/* SALE SEARCH FILTER */}
      <PurchaseFilters filters={filters} setFilters={setFilters} />
      {data && <SalesByProductTable sales={data.data || []} />}
      {/* Table (scroll X only here) */}
      {isLoading? <SkeletonTable /> : error? <p className="text-red-500">Failed to load sales.</p> : ""}
      {data && <SaleTable sales={data.data || []} sortBy={filters.sortBy} sortOrder={filters.sortOrder} />}
      {/* PAGINATION  */}
      {data?.totalPages && Number(data.totalPages) > 1 && <Pagination pageNo={pageNo} setPageNo={setPageNo} totalPages={Number(data.totalPages)} />}
    </div>
  );
}
