"use client";

import { useState, useMemo, useEffect } from "react";
// import Pagination from "./Pagination";
import PurchaseTable from "./PurchaseTable";
import SearchBar from "./SearchBar";
import PurchaseCart from "./PurchaseCart";
import { useSelector } from "react-redux";
import { useGetPurchasesQuery } from "@/redux/slices/purchase/api.parchase";
import DateSelector from "./DateSelector";
import { DateRange, FilterValues } from "@/types/others";
import Pagination from "../../../../reusable/Pagination";
import PurchaseFilters from "@/reusable/PurchaseAndSaleFilter";

// const ITEMS_PER_PAGE = 5;

export default function PurchasesPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string[]>([]);
  const [pageNo, setPageNo] = useState(1);

  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    startDate: "",
    endDate: "",
    limit: 10,
    status: "",
  });


  // Redux states
  const purchase = useSelector((state: any) => state.purchase);
  const { data } = useGetPurchasesQuery({ key: filters.search, range:{startDate:filters.startDate,endDate:filters.endDate }, limit: filters.limit, page: pageNo,status: filters.status });
  console.log(data, "filters in page")

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
      {/* <div className="flex flex-col md:flex-row gap-4">
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

      </div> */}

<PurchaseFilters filters={filters} setFilters={setFilters} />
      {/* Table (scroll X only here) */}
      {data && <PurchaseTable paginatedPurchases={data.data || []} />}
      <Pagination pageNo={pageNo} totalPages={Number(data?.totalPages) || 1} setPageNo={setPageNo} />
    </div>
  );
}
