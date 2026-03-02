"use client";

import { useState, useMemo } from "react";
import SearchBar from "./SearchBar";
import { useCreateSupplierMutation, useGetSuppliersQuery, useUpdateSupplierMutation } from "@/redux/slices/api.slices";
import CreateCustomerForm from "./CreateCustomerForm";
import CustomerTable from "./CustomerTable";
import { CustomerType } from "@/types/customer";
import SkeletonTable from "@/reusable/skeletone";
import ErrorState from "@/reusable/ErrorState";
import { useCreateCustomerMutation, useGetCustomersQuery, useUpdateCustomerMutation } from "@/redux/slices/customer/api.customer";
// import Pagination from "./pagination";


export default function SuppliersPage() {
  // const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerType | null>(null);
  const { data: customers, error, isLoading } = useGetCustomersQuery({search,limit:10 }) //page?: number, limit?: number; search?: string
  const [createCustomer] = useCreateCustomerMutation()
  const [updateCustomer] = useUpdateCustomerMutation()
  console.log(customers, "customer getting")

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: ""
  });


  function openAddModal() {
    setEditing(null);
    setForm({
      name: "",
      phone: "",
      address: "",
      email: ""
    });
    setOpen(true);
  }

  function openEditModal(customer: CustomerType) {
    setEditing(customer);
    setForm({
      name: customer.name,
      phone: customer.phone || "",
      address: customer.address || "",
      email: customer.email || ""
    });
    setOpen(true);
  }

  function handleSubmit() {
    if (editing && editing._id) {
      updateCustomer({ id: editing._id, data: form })
    } else {
      createCustomer(form)
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
        <h1 className="text-2xl font-bold">Customers</h1>

        <button
          onClick={openAddModal}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          + Add Customer
        </button>
      </div>

      {/* Search */}
      <SearchBar search={search} setSearch={setSearch} />
      {isLoading && <SkeletonTable />}
      {/* Table (X scroll only here) */}
      {customers && <CustomerTable paginatedSuppliers={customers.data} openEditModal={openEditModal} handleDelete={handleDelete} />}
      {error && <ErrorState />}
      {/* Pagination */}
      {/* {totalPages > 1 && (
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
      )} */}

      {/* Modal */}
      {open && (
        <CreateCustomerForm {...{ editing, form, setForm, setOpen, handleSubmit }} />
      )}
    </div>
  );
}
