import { useGetJournalEntriesQuery } from '@/redux/slices/journalEntry/api.entry';
import SkeletonTable from '@/reusable/skeletone';
import React from 'react'

export default function JournalTable() {
        const { data: journalEntries, isLoading: journalLoading } = useGetJournalEntriesQuery();
    
    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Journal Entries</h2>
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
                                <th className="p-3 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {journalEntries?.map((entry: any) => (
                                <tr key={entry._id} className="border-b border-slate-800">
                                    <td>{new Date(entry.createdAt).toLocaleDateString("en-GB")}</td>
                                    <td className="p-3">{entry.account?.name || "N/A"}</td>
                                    <td className="p-3">{entry.description || "-"}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs ${entry.type === "debit" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
                                            {entry.type}
                                        </span>
                                    </td>
                                    <td className={`p-3 text-left ${entry.type=='debit'?'text-green-300':"text-red-500"}`}>{entry.type=="debit"?"+":"-"} {entry.amount.toFixed(2)}</td>
                                    <td className="p-3 text-right">{new Date(entry.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}
