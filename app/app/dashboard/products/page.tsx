"use client";

import { useState, useMemo } from "react";
import ProductTable from "./ProductTable";
import CreateProductForm from "./CreateProductForm";
import { useCreateProductMutation, useGetProductsQuery } from "@/redux/slices/product";
import { Product } from "@/types/product";
import Pagination from "./Pagination";


const ITEMS_PER_PAGE = 5;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [createProduct,{}] = useCreateProductMutation();
  const { data: productsData, isLoading } = useGetProductsQuery({ key: search });
  console.log("Products from API:", productsData);


  const [form, setForm] = useState<Omit<Product, "id">>({
    name: "",
    supplier: "",
    costPrice: 0,
    sellingPrice: 0,
    stock: 0,
    unit: "unit",
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
      unit: "unit",
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
      // setProducts((prev) =>
      //   // prev.map((p) => (p.id === editing.id ? { ...editing, ...form } : p))
      // );
    } else {
      createProduct({ data: form })
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
      {productsData && productsData.length > 0 && <ProductTable paginatedProducts={productsData || []} openEditModal={openEditModal} handleDelete={handleDelete} />}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
      )}

      {/* Modal */}
      {open && (
        <CreateProductForm editing={editing} form={form} setForm={setForm} handleSubmit={handleSubmit} setOpen={setOpen} />
      )}
    </div>
  );
}
