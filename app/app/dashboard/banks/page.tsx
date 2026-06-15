"use client";

import { useState } from "react";
import BankAccountCard from "../accounts/BankAccountCard";
import BankAccountForm from "../accounts/BankAccountForm";
import { BankAccount } from "@/types/bank";
import { useGetBanksQuery, useCreateBankMutation, useUpdateBankMutation, useDeleteBankMutation } from "@/redux/slices/api.slices";
import SkeletonTable from "@/reusable/skeletone";
import ErrorState from "@/reusable/ErrorState";

export default function BanksPage() {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<BankAccount | null>(null);
    
    const { data: banks, error, isLoading } = useGetBanksQuery();
    const [createBank] = useCreateBankMutation();
    const [updateBank] = useUpdateBankMutation();
    const [deleteBank] = useDeleteBankMutation();

    const [form, setForm] = useState<Partial<BankAccount>>({});

    const openAddModal = () => {
        setEditing(null);
        setForm({ name: "", accountNumber: "", accountType: "Cash", category: "Asset", balance: 0, notes: "" });
        setOpen(true);
    };

    const handleSubmit = () => {
        if (editing?._id) {
            updateBank({ id: editing._id, data: form });
        } else {
            createBank({ data: form });
        }
        setOpen(false);
    };

    const handleDelete = (id: string) => {
        deleteBank({ id });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <h1 className="text-2xl font-bold">Chart of Accounts</h1>
                <button
                    onClick={openAddModal}
                    className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                >
                    + Add Account
                </button>
            </div>

            <input
                type="text"
                placeholder="Search accounts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-64 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2"
            />

            {isLoading && <SkeletonTable />}
            {error && <ErrorState />}
            {banks && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {banks.map((bank) => (
                        <BankAccountCard
                            key={bank._id}
                            bank={bank}
                            onSave={(id, data) => updateBank({ id, data })}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <BankAccountForm
                open={open}
                editing={editing}
                form={form}
                setForm={setForm}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
            />
        </div>
    );
}