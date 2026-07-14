import type { SaleType } from '@/types/sale';
import type { SortColumn, SortOrder } from '@/types/others';
import SaleItemRow from './SaleItemRow';
import { aggregateSalesProducts } from './utils/saleTable';

export default function DayGroup({
  date,
  dateSales,
  // sortBy,
  // sortOrder,
}: {
  date: string;
  dateSales: SaleType[];
  sortBy: SortColumn;
  sortOrder: SortOrder;
}) {
  const aggregatedProducts = aggregateSalesProducts(dateSales);
  const nonDamageDaySales = dateSales.filter((s) => s.type !== 'DAMAGE');
  const dayTotal = nonDamageDaySales.reduce((sum, s) => sum + s.totalPrice, 0);

  return (
    <div className="bg-slate-900/50">
      <div className="px-5 py-3 bg-slate-800/50 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">{date}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            {dateSales.length} sale{dateSales.length > 1 ? 's' : ''}
          </span>
          <span className="text-sm font-semibold text-slate-200">₹{dayTotal.toFixed(2)}</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-slate-900/30 text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Product name</th>
              <th className="px-3 py-2 text-left font-medium">SKU</th>
              <th className="px-3 py-2 text-left font-medium">Company</th>
              <th className="px-3 py-2 text-right font-medium">Opening </th>
              <th className="px-3 py-2 text-right font-medium">Return </th>
              <th className="px-3 py-2 text-right font-medium">Damage </th>
              <th className="px-3 py-2 text-right font-medium">Total Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {aggregatedProducts.map((item) => (
              <SaleItemRow
                key={
                  item.sku +
                  item.productName +
                  item.price +
                  item.openingQty +
                  item.returnQty +
                  item.damageQty
                }
                item={item}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
