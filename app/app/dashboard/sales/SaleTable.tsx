import { useMemo } from 'react';
import type { SaleType } from '@/types/sale';
import type { SortColumn, SortOrder } from '@/types/others';
import type { GroupedSales } from './types/saleTable';
import { formatDate } from './utils/saleTable';
import { vans } from '@/lib/lib_objects/vans';
import VanCard from './VanCard';

export { flattenSales } from './utils/saleTable';
export type { FlatItem } from './types/saleTable';

export default function SaleTable({
  sales,
  sortBy,
  sortOrder,
}: {
  sales: SaleType[];
  sortBy?: SortColumn;
  sortOrder?: SortOrder;
}) {
  const effectiveSortBy = sortBy || 'productName';
  const effectiveSortOrder = sortOrder || 'asc';

  const grouped = useMemo(() => {
    const result: GroupedSales = {};
    vans.forEach((van) => {
      result[van.vanNo] = {};
    });

    sales.forEach((sale) => {
      const vanKey: string = (sale.vanNo?.toString() || 'Unfilled') as string;
      const dateKey: string = sale.createdAt ? formatDate(sale.createdAt) : 'Unknown';

      if (!result[vanKey]) {
        result[vanKey] = {};
      }
      if (!result[vanKey][dateKey]) {
        result[vanKey][dateKey] = [];
      }
      result[vanKey][dateKey].push(sale);
    });
    return result;
  }, [sales]);
  // console.log(grouped, "Grouped Sales"  )

  if (sales.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
        <div className="text-slate-500 text-sm">No sales found</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {vans.map((van) => (
        <VanCard
          key={van.vanNo}
          van={van}
          vanData={grouped[van.vanNo] || {}}
          sortBy={effectiveSortBy}
          sortOrder={effectiveSortOrder}
        />
      ))}
    </div>
  );
}
