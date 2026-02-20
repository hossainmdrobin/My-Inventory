"use client";

import { useState, useMemo } from "react";
import PurchaseForm from "./PurchaseForm";
import Pagination from "./Pagination";
import PurchaseTable from "./PurchaseTable";
import SearchBar from "./SearchBar";
import PurchaseCart from "./PurchaseCart";

type Purchase = {
  id: number;
  name: string;
  supplier: string;
  items: number;
  totalPrice: number;
  createdBy: string;
};

const ITEMS_PER_PAGE = 5;

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [form, setForm] = useState<Omit<Purchase, "id">>({
    name: "",
    supplier: "",
    items: 0,
    totalPrice: 0,
    createdBy: "",
  });

  const filteredPurchases = useMemo(() => {
    return purchases.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [purchases, search]);

  const totalPages = Math.ceil(filteredPurchases.length / ITEMS_PER_PAGE);

  const paginatedPurchases = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPurchases.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPurchases, currentPage]);

  function openAddModal() {
    setForm({
      name: "",
      supplier: "",
      items: 0,
      totalPrice: 0,
      createdBy: "",
    });
    setOpen(true);
  }

  function handleSubmit() {
    setPurchases((prev) => [...prev, { id: Date.now(), ...form }]);
    setOpen(false);
  }

  function handleDelete(id: number) {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Purchases</h1>

        <button
          onClick={openAddModal}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          + Add Purchase
        </button>
      </div>

      <PurchaseCart />
      <hr />

      {/* Search */}
      <SearchBar search={search} setSearch={setSearch} setCurrentPage={setCurrentPage} />

      {/* Table (scroll X only here) */}
      <PurchaseTable paginatedPurchases={paginatedPurchases} handleDelete={handleDelete} />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
      )}

      {/* Modal */}
      {open && (
        <PurchaseForm form={form} setForm={setForm} handleSubmit={handleSubmit} setOpen={setOpen} />
      )}
    </div>
  );
}
