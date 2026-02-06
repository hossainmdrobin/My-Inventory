"use client";

import { useState, useMemo } from "react";

type Sale = {
  id: number;
  date: string;
  customer: string;
  items: number;
  total: number;
  status: "Paid" | "Pending" | "Due";
  createdBy: string;
};

const ITEMS_PER_PAGE = 5;

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Sale | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [form, setForm] = useState<Omit<Sale, "id">>({
    date: "",
    customer: "",
    items: 0,
    total: 0,
    status: "Paid",
    createdBy: "",
  });

  const filteredSales = useMemo(() => {
    return sales.filter(
      (s) =>
        s.customer.toLowerCase().includes(search.toLowerCase()) ||
        s.createdBy.toLowerCase().includes(search.toLowerCase())
    );
  }, [sales, search]);

  const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);

  const paginatedSales = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSales.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSales, currentPage]);

  function openAddModal() {
    setEditing(null);
    setForm({
      date: new Date().toISOString().split("T")[0],
      customer: "",
      items: 0,
      total: 0,
      status: "Paid",
      createdBy: "",
    });
    setOpen(true);
  }

  function openEditModal(sale: Sale) {
    setEditing(sale);
    setForm({ ...sale });
    setOpen(true);
  }

  function handleSubmit() {
    if (editing) {
      setSales((prev) =>
        prev.map((s) => (s.id === editing.id ? { ...editing, ...form } : s))
      );
    } else {
      setSales((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    setOpen(false);
  }

  function handleDelete(id: number) {
    setSales((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Sales</h1>

        <button
          onClick={openAddModal}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          + Add Sale
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by customer or staff..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2 outline-none"
      />

      {/* Table (X scroll only here) */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-[1000px] w-full text-sm">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-right">Items</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Created By</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedSales.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-slate-400">
                  No sales found
                </td>
              </tr>
            )}

            {paginatedSales.map((sale) => (
              <tr
                key={sale.id}
                className="border-t border-slate-800 hover:bg-slate-900/50"
              >
                <td className="p-3">
                  {new Date(sale.date).toLocaleDateString()}
                </td>
                <td className="p-3">{sale.customer}</td>
                <td className="p-3 text-right">{sale.items}</td>
                <td className="p-3 text-right">{sale.total}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      sale.status === "Paid"
                        ? "bg-green-500/20 text-green-400"
                        : sale.status === "Pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {sale.status}
                  </span>
                </td>
                <td className="p-3">{sale.createdBy}</td>
                <td className="p-3 text-center space-x-3">
                  <button
                    onClick={() => openEditModal(sale)}
                    className="text-blue-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(sale.id)}
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
            <h2 className="text-xl font-semibold">
              {editing ? "Edit Sale" : "Add Sale"}
            </h2>

            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
            />

            <input
              placeholder="Customer"
              value={form.customer}
              onChange={(e) => setForm({ ...form, customer: e.target.value })}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
            />

            <input
              type="number"
              placeholder="Items"
              value={form.items}
              onChange={(e) =>
                setForm({ ...form, items: Number(e.target.value) })
              }
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
            />

            <input
              type="number"
              placeholder="Total"
              value={form.total}
              onChange={(e) =>
                setForm({ ...form, total: Number(e.target.value) })
              }
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
            />

            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as Sale["status"] })
              }
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Due">Due</option>
            </select>

            <input
              placeholder="Created By"
              value={form.createdBy}
              onChange={(e) =>
                setForm({ ...form, createdBy: e.target.value })
              }
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
            />

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
