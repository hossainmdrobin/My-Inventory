"use client";

import { useState, useMemo } from "react";

type Supplier = {
  id: number;
  name: string;
  phone: string;
  address: string;
  addedAt: string;
};

const ITEMS_PER_PAGE = 5;

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [form, setForm] = useState<Omit<Supplier, "id" | "addedAt">>({
    name: "",
    phone: "",
    address: "",
  });

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [suppliers, search]);

  const totalPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE);

  const paginatedSuppliers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSuppliers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSuppliers, currentPage]);

  function openAddModal() {
    setEditing(null);
    setForm({
      name: "",
      phone: "",
      address: "",
    });
    setOpen(true);
  }

  function openEditModal(supplier: Supplier) {
    setEditing(supplier);
    setForm({
      name: supplier.name,
      phone: supplier.phone,
      address: supplier.address,
    });
    setOpen(true);
  }

  function handleSubmit() {
    if (editing) {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === editing.id ? { ...s, ...form } : s
        )
      );
    } else {
      setSuppliers((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...form,
          addedAt: new Date().toISOString(),
        },
      ]);
    }
    setOpen(false);
  }

  function handleDelete(id: number) {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Suppliers</h1>

        <button
          onClick={openAddModal}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          + Add Supplier
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search supplier..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2 outline-none"
      />

      {/* Table (X scroll only here) */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Added</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedSuppliers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-400">
                  No suppliers found
                </td>
              </tr>
            )}

            {paginatedSuppliers.map((supplier) => (
              <tr
                key={supplier.id}
                className="border-t border-slate-800 hover:bg-slate-900/50"
              >
                <td className="p-3">{supplier.name}</td>
                <td className="p-3">{supplier.phone}</td>
                <td className="p-3 max-w-xs truncate">
                  {supplier.address}
                </td>
                <td className="p-3">
                  {new Date(supplier.addedAt).toLocaleDateString()}
                </td>
                <td className="p-3 text-center space-x-3">
                  <button
                    onClick={() => openEditModal(supplier)}
                    className="text-blue-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id)}
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
              {editing ? "Edit Supplier" : "Add Supplier"}
            </h2>

            <input
              placeholder="Supplier Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
            />

            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
            />

            <textarea
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
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
