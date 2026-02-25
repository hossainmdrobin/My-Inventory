"use client";

import { useState, useEffect } from "react";
import SaleCart from "./SaleCart";
import { useSelector } from "react-redux";
import SaleTable from "./SaleTable";
import { useGetSalesQuery } from "@/redux/slices/sales/api.sale";
import PurchaseFilters from "@/reusable/PurchaseAndSaleFilter";
import { FilterValues } from "@/types/others";
import Pagination from "@/reusable/Pagination";

export default function SalesPage() {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string[]>([]);
  const [pageNo, setPageNo] = useState(1)
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    startDate: "",
    endDate: "",
    limit: 10,
    status: "",
  });

  // Redux states
  const sale = useSelector((state: any) => state.sale);
  const { data, isLoading, error } = useGetSalesQuery({ key: filters.search, range: { startDate: filters.startDate, endDate: filters.endDate }, limit: filters.limit, page: pageNo, status: filters.status });

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
      {/* Table (scroll X only here) */}
      {data && <SaleTable sales={data.data || []} />}
      {/* PAGINATION  */}
      {data?.totalPages && Number(data.totalPages)>1 && <Pagination pageNo={pageNo} setPageNo={setPageNo} totalPages={Number(data.totalPages)} />}
    </div>
  );
}
