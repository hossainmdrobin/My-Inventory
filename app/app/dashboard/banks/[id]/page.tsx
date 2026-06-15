"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetBanksQuery } from "@/redux/slices/api.slices";
import SkeletonTable from "@/reusable/skeletone";
import ErrorState from "@/reusable/ErrorState";

interface Transaction {
    id: string;
    date: string;
    description: string;
    type: "credit" | "debit";
    amount: number;
    reference: string;
    balance: number;
}

const dummyTransactions: Transaction[] = [
    { id: "1", date: "2026-06-14", description: "Customer Payment Received", type: "credit", amount: 5000, reference: "REF-001", balance: 25000 },
    { id: "2", date: "2026-06-13", description: "Supplier Payment - ABC Corp", type: "debit", amount: 2500, reference: "REF-002", balance: 20000 },
    { id: "3", date: "2026-06-12", description: "Office Rent Payment", type: "debit", amount: 1200, reference: "REF-003", balance: 22500 },
    { id: "4", date: "2026-06-11", description: "Sales Revenue - Invoice #1024", type: "credit", amount: 3750, reference: "REF-004", balance: 23700 },
    { id: "5", date: "2026-06-10", description: "Utility Bill Payment", type: "debit", amount: 450, reference: "REF-005", balance: 19950 },
    { id: "6", date: "2026-06-09", description: "Service Income - Consulting", type: "credit", amount: 8000, reference: "REF-006", balance: 20400 },
    { id: "7", date: "2026-06-08", description: "Employee Salary - June", type: "debit", amount: 15000, reference: "REF-007", balance: 12400 },
    { id: "8", date: "2026-06-07", description: "Inventory Purchase", type: "debit", amount: 3200, reference: "REF-008", balance: 27400 },
    { id: "9", date: "2026-06-06", description: "Customer Payment - XYZ Ltd", type: "credit", amount: 6200, reference: "REF-009", balance: 30600 },
    { id: "10", date: "2026-06-05", description: "Bank Transfer In", type: "credit", amount: 10000, reference: "REF-010", balance: 24400 },
];

export default function AccountDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: banks, error, isLoading } = useGetBanksQuery();

    const account = banks?.find((b) => b._id === id);

    if (isLoading) return <SkeletonTable />;
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

    const totalCredits = dummyTransactions.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0);
    const totalDebits = dummyTransactions.filter((t) => t.type === "debit").reduce((sum, t) => sum + t.amount, 0);

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
                        <span className="text-sm text-slate-400">{account.accountType}</span>
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
                <div className="p-5 border-b border-slate-800">
                    <h2 className="text-lg font-semibold">Recent Transactions</h2>
                </div>
                <div className="overflow-x-auto">
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
                            {dummyTransactions.map((tx) => (
                                <tr key={tx.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                                    <td className="px-5 py-4 text-sm text-slate-300">{tx.date}</td>
                                    <td className="px-5 py-4 text-sm text-white">{tx.description}</td>
                                    <td className="px-5 py-4 text-sm text-slate-400">{tx.reference}</td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs px-2 py-1 rounded-full ${tx.type === "credit" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
                                            {tx.type === "credit" ? "Credit" : "Debit"}
                                        </span>
                                    </td>
                                    <td className={`px-5 py-4 text-sm text-right font-medium ${tx.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                                        {tx.type === "credit" ? "+" : "-"}{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(tx.amount)}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-right text-slate-300">
                                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(tx.balance)}
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
