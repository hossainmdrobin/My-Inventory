"use client";

import { useState } from "react";
import Link from "next/link";
import { BankAccount } from "@/types/bank";
import { AccountCategory, AccountTypeName } from "@/types/others";

interface BankAccountCardProps {
    bank: BankAccount;
    onSave?: (id: string, data: Partial<BankAccount>) => void;
    onDelete?: (id: string) => void;
}

const categories: AccountCategory[] = ["Asset", "Liability", "Equity", "Income", "Expense"];

const accountTypesByCategory: Record<AccountCategory, AccountTypeName[]> = {
    Asset: ["Cash", "Bank", "Inventory", "Accounts Receivable", "Wallet"],
    Liability: ["Accounts Payable", "Loans"],
    Equity: ["Owner Capital"],
    Income: ["Sales", "Service Income"],
    Expense: ["Salary", "Rent", "Utilities"],
};

export default function BankAccountCard({ bank, onSave, onDelete }: BankAccountCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<Partial<BankAccount>>({});

    const startEditing = () => {
        setForm({
            name: bank.name,
            accountNumber: bank.accountNumber || "",
            category: bank.category,
            accountType: bank.accountType,
            balance: bank.balance,
            notes: bank.notes || "",
        });
        setIsEditing(true);
    };

    const handleSave = () => {
        if (bank._id && onSave) {
            onSave(bank._id, form);
        }
        setIsEditing(false);
        setForm({});
    };

    const handleCancel = () => {
        setIsEditing(false);
        setForm({});
    };

    const updateField = (field: keyof BankAccount, value: string | number) => {
        if (field === "category") {
            const cat = value as AccountCategory;
            const types = accountTypesByCategory[cat];
            setForm((prev) => ({
                ...prev,
                category: cat,
                accountType: types && !types.includes(prev.accountType as AccountTypeName) ? types[0] : prev.accountType,
            }));
        } else {
            setForm((prev) => ({ ...prev, [field]: value }));
        }
    };

    const balance = typeof bank.balance === "number"
        ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(bank.balance)
        : bank.balance;

    const categoryColors: Record<string, string> = {
        Asset: "bg-green-900/50 text-green-400",
        Liability: "bg-red-900/50 text-red-400",
        Equity: "bg-blue-900/50 text-blue-400",
        Income: "bg-purple-900/50 text-purple-400",
        Expense: "bg-orange-900/50 text-orange-400",
    };

    return (
        <div className="rounded-xl bg-slate-900 p-5 border border-slate-800 hover:bg-slate-800/50 transition">
            {!isEditing ? (
                <>
                    <Link href={`/app/dashboard/banks/${bank._id}`} className="block">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white hover:text-blue-400 transition">{bank.name}</h3>
                                {bank.accountNumber && <p className="text-sm text-slate-400">{bank.accountNumber}</p>}
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                                <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[bank.category] || "bg-slate-800 text-slate-300"}`}>
                                    {bank.category}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-900/50 text-blue-400">{bank.accountType}</span>
                        </div>
                        <div className="space-y-2 mt-2">
                            <p className="text-sm text-slate-400">Balance</p>
                            <p className="text-xl font-bold text-green-400">{balance}</p>
                        </div>
                    </Link>
                    {bank.notes && (
                        <p className="mt-3 text-xs text-slate-500 line-clamp-2">{bank.notes}</p>
                    )}
                    <div className="flex gap-3 mt-4 pt-3 border-t border-slate-800 items-center">
                        <button
                            onClick={(e) => { e.preventDefault(); startEditing(); }}
                            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Edit
                        </button>
                        {onDelete && bank._id && <button
                            onClick={(e) => { e.preventDefault(); onDelete(bank._id!); }}
                            className="text-sm text-red-400 hover:underline"
                        >
                            Delete
                        </button>}
                    </div>
                </>
            ) : (
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Account Name</label>
                        <input
                            type="text"
                            value={form.name || ""}
                            onChange={(e) => updateField("name", e.target.value)}
                            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Account Number</label>
                        <input
                            type="text"
                            value={form.accountNumber || ""}
                            onChange={(e) => updateField("accountNumber", e.target.value)}
                            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Category</label>
                            <select
                                value={form.category || ""}
                                onChange={(e) => updateField("category", e.target.value)}
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Account Type</label>
                            <select
                                value={form.accountType || ""}
                                onChange={(e) => updateField("accountType", e.target.value)}
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                            >
                                {(accountTypesByCategory[form.category || "Asset"] || []).map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Balance</label>
                        <input
                            type="number"
                            value={form.balance ?? 0}
                            onChange={(e) => updateField("balance", parseFloat(e.target.value) || 0)}
                            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Notes</label>
                        <textarea
                            value={form.notes || ""}
                            onChange={(e) => updateField("notes", e.target.value)}
                            rows={2}
                            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleSave}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
