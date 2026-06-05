"use client";

import { useState, useMemo } from "react";
import SearchBar from "./SearchBar";
import { useCreateSupplierMutation, useGetSuppliersQuery, useUpdateSupplierMutation } from "@/redux/slices/api.slices";
import CreateSuppilerForm from "./CreateSuppilerForm";
import SupplierTable from "./SupplierTable";
import { Supplier } from "@/types/supplier";
import SkeletonTable from "@/reusable/skeletone";
import ErrorState from "@/reusable/ErrorState";
// import Pagination from "./pagination";


export default function SuppliersPage() {
  // const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const { data: suppliers, error, isLoading } = useGetSuppliersQuery({ key: search })
  const [createSupplier, {  }] = useCreateSupplierMutation()
  const [updateSupplier, { }] = useUpdateSupplierMutation()

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });


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
      address: supplier.address || "",
    });
    setOpen(true);
  }

  function handleSubmit() {
    if (editing && editing._id) {
      updateSupplier({id:editing._id,data:form})
    } else {
      createSupplier({ data: form })
    }
    setOpen(false);
  }

  function handleDelete(_id: string) {
    // setSuppliers((prev) => prev.filter((s) => s.id !== id));
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
      <SearchBar search={search} setSearch={setSearch} />
      {isLoading && <SkeletonTable />}
      {/* Table (X scroll only here) */}
      {suppliers && <SupplierTable paginatedSuppliers={suppliers} openEditModal={openEditModal} handleDelete={handleDelete} />}
      {error && <ErrorState />}
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
