"use client";

import { useState, useMemo, useEffect } from "react";
// import PurchaseForm from "./PurchaseForm";
import Pagination from "./Pagination";
import PurchaseTable from "./SaleTable";
import SaleCart from "./SaleCart";
import { useSelector } from "react-redux";
import SaleTable from "./SaleTable";
import { useGetSalesQuery } from "@/redux/slices/sales/api.sale";
import SearchBar from "./SearchBar";

export default function SalesPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string[]>([]);

  // Redux states
  const sale = useSelector((state: any) => state.sale);
      const {data, isLoading, error} = useGetSalesQuery({key:""});
      console.log(data, isLoading, error,"sele data");


  useEffect(() => {
    setSelectedId(sale.items.map((item: any) => item.productId));
  }, [sale]);
    

  // const filteredPurchases = useMemo(() => {
  //   return purchases.filter((p) =>
  //     p.name.toLowerCase().includes(search.toLowerCase())
  //   );
  // }, [purchases, search]);

  // const totalPages = Math.ceil(filteredPurchases.length / ITEMS_PER_PAGE);

  // const paginatedPurchases = useMemo(() => {
  //   const start = (currentPage - 1) * ITEMS_PER_PAGE;
  //   return filteredPurchases.slice(start, start + ITEMS_PER_PAGE);
  // }, [filteredPurchases, currentPage]);

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

      {open && <SaleCart setCartOpen={setOpen} sale={sale} selectedIds={selectedId}/>}
      <hr />

      {/* Search */}
      <SearchBar  search={search} setSearch={setSearch} setCurrentPage={setCurrentPage} />

      {/* Table (scroll X only here) */}
      {data && <SaleTable paginatedPurchases={data || []}  />}

      {/* Pagination */}
      {/* {totalPages > 1 && (
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
      )} */}

      {/* Modal */}
      {/* {open && (
        <PurchaseForm form={form} setForm={setForm} handleSubmit={handleSubmit} setOpen={setOpen} />
      )} */}
    </div>
  );
}
