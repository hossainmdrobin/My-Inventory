import React, { useState } from 'react'
import SummaryCard from './SummaryCard'
import { SalesReport } from '@/types/report';
import { useGetSalesQuery } from '@/redux/slices/sales/api.sale';

export default function SaleReport({ totalPaidAmount, totalSaleAmount, totalSales, totalUnpaidAmount }: SalesReport) {
    const [salesStart, setSalesStart] = useState("");
    const [salesEnd, setSalesEnd] = useState("");
    const { data } = useGetSalesQuery({ page: 1, limit: 10 })
    console.log(data, "Seldata in repotg")

    const clearSalesFilter = () => {
        setSalesStart("");
        setSalesEnd("");
    };
    return (
        <section className="space-y-6">
            {/* Filter row */}
            <div className="flex flex-col md:flex-row gap-3 sm:items-end justify-between">
                <div className="sm:flex gap-3">
                    <SummaryCard title="Total Sales" value={(totalSaleAmount || 0).toString()} />
                    <SummaryCard title="Paid Amount" value={(totalPaidAmount || 0).toString()} />
                    <SummaryCard title="Unpaid Amount" value={(totalUnpaidAmount || 0).toString()} tone={(totalPaidAmount || 0) > 0 ? "warn" : "ok"} />
                </div>
                <div className=" sm:flex gap-3 md:items-end">
                    <div>
                        <label className="block text-sm text-slate-300">Start</label>
                        <input value={salesStart} onChange={(e) => setSalesStart(e.target.value)} type="date" className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-300">End</label>
                        <input value={salesEnd} onChange={(e) => setSalesEnd(e.target.value)} type="date" className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" />
                    </div>
                    <div className='my-2 md:my-0'>
                        <button onClick={clearSalesFilter} className="rounded-lg border border-slate-700 px-3 py-2">Clear filter</button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="min-w-[1000px] w-full text-sm">
                    <thead className="bg-slate-900 text-slate-300">
                        <tr>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Vehicle</th>
                            <th className="p-3 text-right">Amount</th>
                        </tr>
                    </thead>

                    {data && <tbody>
                        {data?.data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-4 text-center text-slate-400">No sales for the selected range</td>
                            </tr>
                        ) : (
                            data?.data.map((s) => (
                                <tr key={s._id} className="border-t border-slate-800 hover:bg-slate-900/50">
                                    <td className="p-3">{s.createdAt?.toLocaleString("en-GB")}</td>
                                    <td className="p-3">{s.vehicle}</td>
                                    <td className="p-3 text-right">{s.totalPrice}</td>
                                    <td className="p-3"></td>
                                </tr>
                            ))
                        )}
                    </tbody>}
                </table>
            </div>
        </section>
    )
}
