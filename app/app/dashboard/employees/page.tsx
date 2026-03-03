"use client";

import { useState } from "react";
import SkeletonTable from "@/reusable/skeletone";
import ErrorState from "@/reusable/ErrorState";
import EmployeeForm from "./EmployeeForm";
import EmployeeTable from "./EmployeeTable"
import SearchBar from "./SearchBar";
import { Employee } from "@/types/employee";
import { useCreateEmployeeMutation, useGetEmployeesQuery, useUpdateEmployeeMutation } from "@/redux/slices/employee/api.employee";
// import Pagination from "./pagination";


export default function SuppliersPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const { data: employees, error, isLoading } = useGetEmployeesQuery({search,limit:10 }) //page?: number, limit?: number; search?: string
  const [createEmployee] = useCreateEmployeeMutation()
  const [updateEmployee] = useUpdateEmployeeMutation()
  console.log(employees, "employees getting")

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    role:"seller"
  });


  function openAddModal() {
    setEditing(null);
    setForm({
      name: "",
      phone: "",
      address: "",
      email: "",
      role:"seller"
    });
    setOpen(true);
  }

  function openEditModal(employee: Employee) {
    setEditing(employee);
    setForm({
      name: employee.name,
      phone: employee.phone || "",
      address: employee.address || "",
      email: employee.email || "",
      role:employee.role 
    });
    setOpen(true);
  }

  function handleSubmit() {
    if (editing && editing._id) {
      updateEmployee({ id: editing._id, data: form })
    } else {
      createEmployee(form)
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
        <h1 className="text-2xl font-bold">Employee</h1>

        <button
          onClick={openAddModal}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          + Add Employee
        </button>
      </div>

      {/* Search */}
      <SearchBar search={search} setSearch={setSearch} />
      {isLoading && <SkeletonTable />}
      {/* Table (X scroll only here) */}
      {employees && <EmployeeTable paginatedSuppliers={employees.data} openEditModal={openEditModal} handleDelete={handleDelete} />}
      {error && <ErrorState />}
      {/* Pagination */}
      {/* {totalPages > 1 && (
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
      )} */}

      {/* Modal */}
      {open && (
        <EmployeeForm {...{ editing, form, setForm, setOpen, handleSubmit }} />
      )}
    </div>
  );
}
