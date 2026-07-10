import { useMemo } from 'react';
import { SaleType } from '@/types/sale';
import { vans } from "@/lib/lib_objects/vans"
import { SortColumn, SortOrder } from '@/types/others';


type GroupedSales = {
  [vanNo: string]: {
    [date: string]: SaleType[];
  };
};

type SortConfig = {
  sortBy: SortColumn;
  sortOrder: SortOrder;
};

export type FlatItem = {
  saleId: string;
  saleType: string;
  note: string;
  sku: string;
  supplierName: string;
  productName: string;
  price: number;
  openingQty: number;
  returnQty: number;
  damageQty: number;
  totalPrice: number;
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getVanColor(van: string): string {
  const colors: Record<string, string> = {
    '1': 'from-blue-500 to-blue-600',
    '2': 'from-emerald-500 to-emerald-600',
    '3': 'from-amber-500 to-amber-600',
    '4': 'from-rose-500 to-rose-600',
  };
  return colors[van] || 'from-slate-500 to-slate-600';
}

export function flattenSales(sales: SaleType[]): FlatItem[] {
  const items: FlatItem[] = [];
  sales.forEach((sale) => {
    if (sale.items && sale.items.length > 0) {
      sale.items.forEach((item) => {
        const productObj = item.productId as any;
        const isPopulated = typeof productObj === 'object' && productObj !== null;
        const productName = isPopulated ? productObj?.name || item.name || 'Unknown' : 'Unknown';
        const sku = isPopulated ? productObj?.sku || '-' : '-';
        const supplierName = item.supplier || (isPopulated ? productObj?.supplier?.name || '-' : '-');
        const price = item.sellingPrice || item.costPrice || 0;

        const type = (sale.type?.toString() || 'SALE') as string;
        const openingQty = (type === 'OPENING' || type === 'SALE') ? item.quantity : 0;
        const returnQty = (type === 'RETURN') ? item.quantity : 0;
        const damageQty = (type === 'DAMAGE') ? item.quantity : 0;
        const totalPrice = (type !== 'DAMAGE' && type !== 'RETURN') ? item.quantity * price : 0;

        items.push({
          saleId: sale._id || '',
          saleType: type,
          note: sale.note || '',
          sku,
          supplierName,
          productName,
          price,
          openingQty,
          returnQty,
          damageQty,
          totalPrice,
        });
      });
    }
  });
  return items;
}

function sortFlatItems(items: FlatItem[], sortBy: SortColumn, sortOrder: SortOrder): FlatItem[] {
  return [...items].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'productName':
        comparison = a.productName.localeCompare(b.productName);
        break;
      case 'supplierName':
        comparison = a.supplierName.localeCompare(b.supplierName);
        break;
      case 'quantity':
        comparison = a.openingQty - b.openingQty;
        break;
      case 'totalPrice':
        comparison = a.totalPrice - b.totalPrice;
        break;
      case 'totalReturn':
        comparison = a.returnQty - b.returnQty;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });
}

export default function SaleTable({ sales, sortBy, sortOrder }: { sales: SaleType[]; sortBy?: SortColumn; sortOrder?: SortOrder }) {
  const effectiveSortBy = sortBy || 'productName';
  const effectiveSortOrder = sortOrder || 'asc';
  const grouped = useMemo(() => {
    const result: GroupedSales = {};
    vans.forEach((van) => {
      result[van.vanNo] = {};
    });

    sales.forEach((sale) => {
      const vanKey: string = (sale.vanNo?.toString() || 'Unfilled') as string;
      const dateKey: string = sale.createdAt ? formatDate(sale.createdAt as any) : 'Unknown';

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

  if (sales.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
        <div className="text-slate-500 text-sm">No sales found</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {vans.map((van) => {
        const vanData = grouped[van.vanNo] || {};
        const vanSales = Object.values(vanData).flat();
        console.log(`Van ${van.vanNo} (${van.name}) has ${vanSales} sales.`);
        const flatItems = flattenSales(vanSales);
        const nonDamageSales = vanSales.filter(s => s.type !== 'DAMAGE');
        const totalAmount = nonDamageSales.reduce((sum, s) => sum + s.totalPrice, 0);
        const totalPaid = nonDamageSales.reduce((sum, s) => sum + s.paid, 0);
        const totalDue = nonDamageSales.reduce((sum, s) => sum + s.due, 0);

        return (
          <div
            key={van.vanNo}
            className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden"
          >
            <div className={`bg-gradient-to-r ${getVanColor(van.vanNo)} px-5 py-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
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
                Object.entries(vanData).map(([date, dateSales]) => {
                  const dayItems = sortFlatItems(flattenSales(dateSales), effectiveSortBy, effectiveSortOrder);
                  const nonDamageDaySales = dateSales.filter(s => s.type !== 'DAMAGE');
                  const dayTotal = nonDamageDaySales.reduce((sum, s) => sum + s.totalPrice, 0);
                  return (
                    <div key={date} className="bg-slate-900/50">
                      <div className="px-5 py-3 bg-slate-800/50 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-300">{date}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500">
                            {dateSales.length} sale{dateSales.length > 1 ? 's' : ''}
                          </span>
                          <span className="text-sm font-semibold text-slate-200">
                            ₹{dayTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-[900px] w-full text-sm">
                          <thead className="bg-slate-900/30 text-slate-500">
                            <tr>
                              <th className="px-3 py-2 text-left font-medium">Product name</th>
                              <th className="px-3 py-2 text-left font-medium">SKU</th>
                              <th className="px-3 py-2 text-left font-medium">Company</th>
                              <th className="px-3 py-2 text-right font-medium">Opening quantity</th>
                              <th className="px-3 py-2 text-right font-medium">Return quantity</th>
                              <th className="px-3 py-2 text-right font-medium">Damage quantity</th>
                              <th className="px-3 py-2 text-right font-medium">Total Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/50">
                            {dayItems.map((item) => (
                              <tr key={item.saleId + item.productName + item.price + item.openingQty + item.returnQty + item.damageQty} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-3 py-2.5 text-slate-300 text-sm">
                                  {item.productName}
                                </td>
                                <td className="px-3 py-2.5 text-slate-400 text-xs">
                                  {item.sku}
                                </td>
                                <td className="px-3 py-2.5 text-slate-300 text-sm">
                                  {item.supplierName}
                                </td>
                                <td className="px-3 py-2.5 text-right text-slate-200">
                                  {item.openingQty}
                                </td>
                                <td className="px-3 py-2.5 text-right text-slate-400">
                                  {item.returnQty}
                                </td>
                                <td className="px-3 py-2.5 text-right text-slate-400 text-red-400/80">
                                  {item.damageQty}
                                </td>
                                <td className="px-3 py-2.5 text-right text-slate-200 font-medium">
                                  ₹{item.totalPrice.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
