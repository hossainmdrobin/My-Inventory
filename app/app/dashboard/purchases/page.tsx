"use client";

import { useState, useMemo, useEffect } from "react";
// import Pagination from "./Pagination";
import PurchaseTable from "./PurchaseTable";
import SearchBar from "./SearchBar";
import PurchaseCart from "./PurchaseCart";
import { useSelector } from "react-redux";
import { useGetPurchasesQuery } from "@/redux/slices/purchase/api.parchase";
import DateSelector from "./DateSelector";
import { DateRange } from "@/types/others";
import Pagination from "./Pagination";

// const ITEMS_PER_PAGE = 5;

export default function PurchasesPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string[]>([]);
  const [pagData, setPagData] = useState({ limit: 20, page: 1 })
  const [range, setRange] = useState<DateRange>({
    startDate: "",
    endDate: "",
  });

  // Redux states
  const purchase = useSelector((state: any) => state.purchase);
  const { data } = useGetPurchasesQuery({ key: search, range, limit: pagData.limit, page: pagData.page });

console.log(data?.totalPages, "total pages")
  useEffect(() => {
    setSelectedId(purchase.items.map((item: any) => item.productId));
  }, [purchase]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Purchases</h1>

        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          + Add Purchase
        </button>
      </div>


      {open && <PurchaseCart setCartOpen={setOpen} purchase={purchase} selectedIds={selectedId} />}
      <hr />

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div>
          <SearchBar search={search} setSearch={setSearch} />
          <p className="text-sm mt-2">Item per page</p>
          <input
            type="number"
            placeholder="Items per page"
            value={pagData.limit}
            onChange={(e) => setPagData((prev) => ({ ...prev, limit: parseInt(e.target.value) || 20, page: 1 }))}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2 outline-none"
          />

        </div>

        <DateSelector range={range} setRange={setRange} />

      </div>

      {/* Table (scroll X only here) */}
      {data && <PurchaseTable paginatedPurchases={data.data || []} />}
      <Pagination pageData={pagData} totalPages={data?.totalPages || 1} setPagData={(params) => setPagData({ limit: params.limit ?? pagData.limit, page: params.page })} />
    </div>
  );
}
