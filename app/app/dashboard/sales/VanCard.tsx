import type { GroupedSales } from './types/saleTable';
import type { SortColumn, SortOrder } from '@/types/others';
import DayGroup from './DayGroup';
import { getVanColor } from './utils/saleTable';

export default function VanCard({
  van,
  vanData,
  sortBy,
  sortOrder,
}: {
  van: { vanNo: string; name: string };
  vanData: GroupedSales[string];
  sortBy: SortColumn;
  sortOrder: SortOrder;
}) {
  const vanSales = Object.values(vanData).flat();
  const nonDamageSales = vanSales.filter((s) => s.type !== 'DAMAGE');
  const totalAmount = nonDamageSales.reduce((sum, s) => sum + s.totalPrice, 0);
  const totalPaid = nonDamageSales.reduce((sum, s) => sum + s.paid, 0);
  const totalDue = nonDamageSales.reduce((sum, s) => sum + s.due, 0);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
      <div className={`bg-gradient-to-r ${getVanColor(van.vanNo)} px-5 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{van.name}</h3>
              <p className="text-white/70 text-xs">{vanSales.length} sales</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold">₹{totalAmount.toFixed(2)}</div>
            <div className="flex gap-3 text-xs text-white/80">
              <span>Paid: ₹{totalPaid.toFixed(2)}</span>
              <span>Due: ₹{totalDue.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="divide-y divide-slate-800">
        {Object.entries(vanData).length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-sm">
            No sales recorded
          </div>
        ) : (
          Object.entries(vanData).map(([date, dateSales]) => (
            <DayGroup
              key={date}
              date={date}
              dateSales={dateSales}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          ))
        )}
      </div>
    </div>
  );
}
