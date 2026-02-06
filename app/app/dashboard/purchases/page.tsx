"use client";

import { useState, useMemo } from "react";

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

      {/* Search */}
      <input
        type="text"
        placeholder="Search purchase..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2 outline-none"
      />

      {/* Table (scroll X only here) */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Supplier</th>
              <th className="p-3 text-right">Items</th>
              <th className="p-3 text-right">Total Price</th>
              <th className="p-3 text-left">Created By</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedPurchases.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-400">
                  No purchases found
                </td>
              </tr>
            )}

            {paginatedPurchases.map((purchase) => (
              <tr
                key={purchase.id}
                className="border-t border-slate-800 hover:bg-slate-900/50"
              >
                <td className="p-3">{purchase.name}</td>
                <td className="p-3">{purchase.supplier}</td>
                <td className="p-3 text-right">{purchase.items}</td>
                <td className="p-3 text-right">{purchase.totalPrice}</td>
                <td className="p-3">{purchase.createdBy}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDelete(purchase.id)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-end items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 rounded-lg border border-slate-700 disabled:opacity-40"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-lg border ${
                currentPage === i + 1
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-slate-700"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 rounded-lg border border-slate-700 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl bg-slate-900 p-6 space-y-4">
            <h2 className="text-xl font-semibold">Add Purchase</h2>

            {[
              ["name", "Purchase Name"],
              ["supplier", "Supplier"],
              ["items", "Items"],
              ["totalPrice", "Total Price"],
              ["createdBy", "Created By"],
            ].map(([key, label]) => (
              <input
                key={key}
                type={
                  key === "items" || key === "totalPrice"
                    ? "number"
                    : "text"
                }
                placeholder={label}
                value={(form as any)[key]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [key]:
                      key === "items" || key === "totalPrice"
                        ? Number(e.target.value)
                        : e.target.value,
                  })
                }
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
              />
            ))}

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-blue-600 font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
