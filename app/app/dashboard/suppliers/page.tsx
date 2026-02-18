"use client";

import { useState, useMemo } from "react";
import SearchBar from "./SearchBar";
import { useCreateSupplierMutation, useGetSuppliersQuery } from "@/redux/slices/api.slices";
import CreateSuppilerForm from "./CreateSuppilerForm";
import SupplierTable from "./SupplierTable";
// import Pagination from "./pagination";

type Supplier = {
  id?: number;
  name: string;
  phone: string;
  address: string;
  addedAt?: string;
};

const ITEMS_PER_PAGE = 5;

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: supplierData, error, isLoading } = useGetSuppliersQuery({ key: search })
  const [createSupplier,{data:createSupplierData, error:createErr, isLoading:createLoading}] = useCreateSupplierMutation()
  console.log(supplierData, "Supplier data arived")
console.log(createSupplierData,"Create")

  const [form, setForm] = useState({
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
      createSupplier({ data: form })
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
      <SearchBar search={search} setSearch={setSearch} setCurrentPage={setCurrentPage} />

      {/* Table (X scroll only here) */}
      {/* <SupplierTable paginatedSuppliers={paginatedSuppliers} openEditModal={openEditModal} handleDelete={handleDelete} /> */}

      {/* Pagination */}
      {/* {totalPages > 1 && (
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
      )} */}

      {/* Modal */}
      {open && (
        <CreateSuppilerForm {...{ editing, form, setForm, setOpen, handleSubmit }} />
      )}
    </div>
  );
}
