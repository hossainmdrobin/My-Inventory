import type { PurchaseReport } from '@/types/report'
import { useState } from 'react'
import SummaryCard from './SummaryCard';
import { useGetPurchasesQuery } from '@/redux/slices/purchase/api.parchase';
import SkeletonTable from '@/reusable/skeletone';

export default function PurchaseReport({ totalPurchaseAmount,
  totalPaidAmount,
  totalUnpaidAmount,
  totalPurchases }: PurchaseReport) {
    // Filters for sales & purchases
  const [purchStart, setPurchStart] = useState("");
  const [purchEnd, setPurchEnd] = useState("");

  const clearPurchFilter = () => {
    setPurchStart("");
    setPurchEnd("");
  };
  const { data, isLoading } = useGetPurchasesQuery({limit:10,range:{startDate:purchStart,endDate:purchEnd}})
  console.log(data,"laskdf asdf")
  return (
    <section className="space-y-6">
      {/* Filter row */}
      <div className="flex flex-col sm:flex-row gap-3 items-end justify-between">
        <div className="flex gap-3 items-end">
          <div>
            <label className="block text-sm text-slate-300">Start</label>
            <input value={purchStart} onChange={(e) => setPurchStart(e.target.value)} type="date" className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-slate-300">End</label>
            <input value={purchEnd} onChange={(e) => setPurchEnd(e.target.value)} type="date" className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" />
          </div>
          <div>
            <button onClick={clearPurchFilter} className="rounded-lg border border-slate-700 px-3 py-2">Clear filter</button>
          </div>
        </div>

        {/* Summary card */}
        <div className="flex gap-3">
          <SummaryCard title="Total Purchase" value={(totalPurchaseAmount || 0).toString()} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        {data && <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Supplier</th>
              <th className="p-3 text-right">Items</th>
              <th className="p-3 text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {data?.data?.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-slate-400">No purchases for the selected range</td>
              </tr>
            ) : (
              data?.data?.map((p) => (
                <tr key={p._id} className="border-t border-slate-800 hover:bg-slate-900/50">
                  <td className="p-3">{formatDate(p.createdAt)}</td>
                  <td className="p-3">{p.supplier}</td>
                  <td className="p-3 text-right">{""}</td>
                  <td className="p-3 text-right">{}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>}
        {isLoading && <SkeletonTable />}
      </div>
    </section>
  )
}

export const formatDate = (date?: string | Date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-GB");
};
