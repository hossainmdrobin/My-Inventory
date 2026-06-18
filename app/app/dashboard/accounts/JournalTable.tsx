import { useGetJournalEntriesQuery } from '@/redux/slices/journalEntry/api.entry';
import { useGetBanksQuery } from '@/redux/slices/api.slices';
import SkeletonTable from '@/reusable/skeletone';
import React, { useState } from 'react'

export default function JournalTable() {
    const [walletId, setWalletId] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [limit, setLimit] = useState<number>(5);

    const { data: banks } = useGetBanksQuery();
    const { data: journalEntries, isLoading: journalLoading } = useGetJournalEntriesQuery({
        wallet_id: walletId || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        limit,
    });

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Journal Entries</h2>
            <div className="flex flex-wrap gap-4 mb-4">
                <div>
                    <label className="block text-sm text-slate-400 mb-1">Account</label>
                    <select
                        value={walletId}
                        onChange={(e) => setWalletId(e.target.value)}
                        className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
                    >
                        <option value="">All Accounts</option>
                        {banks?.map((bank: any) => (
                            <option key={bank._id} value={bank._id}>{bank.name}</option>
                        ))}
                    </select>
                </div>
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
            {journalLoading && <SkeletonTable />}
            {journalEntries && (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className='text-left'>Date</th>
                                <th className="p-3 text-left">Account</th>
                                <th className="p-3 text-left">Description</th>
                                <th className="p-3 text-left">Type</th>
                                <th className="p-3 text-left">Amount</th>
                                <th className="p-3 text-right">New Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {journalEntries?.map((entry: any) => (
                                <tr key={entry._id} className="border-b border-slate-800">
                                    <td>{new Date(entry.createdAt).toLocaleDateString("en-GB")}</td>
                                    <td className="p-3">{entry.account?.name || "N/A"}</td>
                                    <td className="p-3">{entry.description || "-"}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs ${entry.type === "credit" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
                                            {entry.type}
                                        </span>
                                    </td>
                                    <td className={`p-3 text-left ${entry.type=='credit'?'text-green-300':"text-red-500"}`}>{entry.type=="credit"?"+":"-"} {entry.amount.toFixed(2)}</td>
                                    <td className="p-3 text-right">{entry.newBalance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}
