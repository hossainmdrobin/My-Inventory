"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetBanksQuery } from "@/redux/slices/api.slices";
import SkeletonTable from "@/reusable/skeletone";
import ErrorState from "@/reusable/ErrorState";
import { useState } from "react";
import { useGetJournalEntriesQuery } from "@/redux/slices/journalEntry/api.entry";


export default function AccountDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: banks, error, isLoading } = useGetBanksQuery();

    const account = banks?.find((b) => b._id === id);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [limit, setLimit] = useState<number>(5);

    const { data: journalEntries, isLoading: journalLoading } = useGetJournalEntriesQuery({
        wallet_id: id || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        limit,
    });

    if (isLoading || journalLoading) return <SkeletonTable />;
    if (error) return <ErrorState />;
    if (!account) {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => router.back()}
                    className="text-sm text-blue-400 hover:underline"
                >
                    ← Back to Accounts
                </button>
                <div className="text-center py-12">
                    <p className="text-slate-400">Account not found</p>
                </div>
            </div>
        );
    }

    const formattedBalance = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(account.balance);

    const categoryColors: Record<string, string> = {
        Asset: "bg-green-900/50 text-green-400 border-green-700",
        Liability: "bg-red-900/50 text-red-400 border-red-700",
        Equity: "bg-blue-900/50 text-blue-400 border-blue-700",
        Income: "bg-purple-900/50 text-purple-400 border-purple-700",
        Expense: "bg-orange-900/50 text-orange-400 border-orange-700",
    };

    const totalCredits = journalEntries?.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0) ?? 0;
    const totalDebits = journalEntries?.filter((t) => t.type === "debit").reduce((sum, t) => sum + t.amount, 0) ?? 0;

    return (
        <div className="space-y-6">
            <button
                onClick={() => router.back()}
                className="text-sm text-blue-400 hover:underline"
            >
                ← Back to Accounts
            </button>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">{account.name}</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full border ${categoryColors[account.category] || "bg-slate-800 text-slate-300 border-slate-600"}`}>
                            {account.category}
                        </span>
                        <span className="text-sm text-slate-400">{account.type}</span>
                    </div>
                </div>
                {account.accountNumber && (
                    <span className="text-sm text-slate-500">#{account.accountNumber}</span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl bg-slate-900 p-5 border border-slate-800">
                    <p className="text-sm text-slate-400 mb-1">Current Balance</p>
                    <p className="text-2xl font-bold text-green-400">{formattedBalance}</p>
                </div>
                <div className="rounded-xl bg-slate-900 p-5 border border-slate-800">
                    <p className="text-sm text-slate-400 mb-1">Total Credits</p>
                    <p className="text-2xl font-bold text-blue-400">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalCredits)}
                    </p>
                </div>
                <div className="rounded-xl bg-slate-900 p-5 border border-slate-800">
                    <p className="text-sm text-slate-400 mb-1">Total Debits</p>
                    <p className="text-2xl font-bold text-red-400">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalDebits)}
                    </p>
                </div>
            </div>

            {account.notes && (
                <div className="rounded-xl bg-slate-900 p-5 border border-slate-800">
                    <p className="text-sm text-slate-400 mb-1">Notes</p>
                    <p className="text-sm text-slate-300">{account.notes}</p>
                </div>
            )}

            <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <h2 className="text-xl font-semibold mb-4">Journal Entries</h2>
                    <div className="flex flex-wrap gap-4 mb-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">From</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">To</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Limit</label>
                            <input
                                type="number"
                                value={limit}
                                onChange={(e) => setLimit(Number(e.target.value))}
                                min={1}
                                className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm w-24"
                            />
                        </div>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-sm text-slate-400 border-b border-slate-800">
                                <th className="px-5 py-3 font-medium">Date</th>
                                <th className="px-5 py-3 font-medium">Description</th>
                                <th className="px-5 py-3 font-medium">Reference</th>
                                <th className="px-5 py-3 font-medium">Type</th>
                                <th className="px-5 py-3 font-medium text-right">Amount</th>
                                <th className="px-5 py-3 font-medium text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {journalEntries?.map((tx) => (
                                <tr key={tx._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                                    <td className="px-5 py-4 text-sm text-slate-300">{new Date(tx.createdAt).toLocaleDateString("en-GB")}</td>
                                    <td className="px-5 py-4 text-sm text-white">{tx.description}</td>
                                    <td className="px-5 py-4 text-sm text-slate-400">{"Reference"}</td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs px-2 py-1 rounded-full ${tx.type === "credit" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
                                            {tx.type === "credit" ? "Credit" : "Debit"}
                                        </span>
                                    </td>
                                    <td className={`px-5 py-4 text-sm text-right font-medium ${tx.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                                        {tx.type === "credit" ? "+" : "-"}{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(tx.amount)}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-right text-slate-300">
                                        {typeof tx.newBalance === "number"
                                            ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(tx.newBalance)
                                            : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
