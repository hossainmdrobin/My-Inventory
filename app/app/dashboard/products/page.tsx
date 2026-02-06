"use client";

import { useState, useMemo } from "react";

type Product = {
  id: number;
  name: string;
  supplier: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
};

const ITEMS_PER_PAGE = 5;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [form, setForm] = useState<Omit<Product, "id">>({
    name: "",
    supplier: "",
    costPrice: 0,
    sellingPrice: 0,
    stock: 0,
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  function openAddModal() {
    setEditing(null);
    setForm({
      name: "",
      supplier: "",
      costPrice: 0,
      sellingPrice: 0,
      stock: 0,
    });
    setOpen(true);
  }

  function openEditModal(product: Product) {
    setEditing(product);
    setForm(product);
    setOpen(true);
  }

  function handleSubmit() {
    if (editing) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...editing, ...form } : p))
      );
    } else {
      setProducts((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    setOpen(false);
  }

  function handleDelete(id: number) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={openAddModal}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search product..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2 outline-none"
      />

      {/* Table (Scroll X only here) */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Supplier</th>
              <th className="p-3 text-right">Cost Price</th>
              <th className="p-3 text-right">Selling Price</th>
              <th className="p-3 text-right">Stock</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-400">
                  No products found
                </td>
              </tr>
            )}

            {paginatedProducts.map((product) => (
              <tr
                key={product.id}
                className="border-t border-slate-800 hover:bg-slate-900/50"
              >
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.supplier}</td>
                <td className="p-3 text-right">{product.costPrice}</td>
                <td className="p-3 text-right">{product.sellingPrice}</td>
                <td className="p-3 text-right">{product.stock}</td>
                <td className="p-3 text-center space-x-3">
                  <button
                    onClick={() => openEditModal(product)}
                    className="text-blue-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
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
              {editing ? "Edit Product" : "Add Product"}
            </h2>

            {[
              ["name", "Product Name"],
              ["supplier", "Supplier"],
              ["costPrice", "Cost Price"],
              ["sellingPrice", "Selling Price"],
              ["stock", "Stock"],
            ].map(([key, label]) => (
              <input
                key={key}
                type={key.includes("Price") || key === "stock" ? "number" : "text"}
                placeholder={label}
                value={(form as any)[key]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [key]:
                      key.includes("Price") || key === "stock"
                        ? Number(e.target.value)
                        : e.target.value,
                  })
                }
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 outline-none"
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
