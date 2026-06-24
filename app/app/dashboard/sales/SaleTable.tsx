import React, { useMemo } from 'react';
import { SaleType } from '@/types/sale';

const VANS = ['1', '2', '3', '4'];

type GroupedSales = {
  [vanNo: string]: {
    [date: string]: SaleType[];
  };
};

type FlatItem = {
  saleId: string;
  saleType: string;
  note: string;
  itemId: string;
  itemName: string;
  unitPrice: number;
  quantity: number;
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

function flattenSales(sales: SaleType[]): FlatItem[] {
  const items: FlatItem[] = [];
  sales.forEach((sale) => {
    if (sale.items && sale.items.length > 0) {
      sale.items.forEach((item, idx) => {
        const productName =
          typeof item.productId === 'string'
            ? item.productId
            : (item.productId as any)?.name || 'Unknown';
        items.push({
          saleId: sale._id || '',
          saleType: sale.type || 'SALE',
          note: sale.note || '',
          itemId: `${sale._id}_${idx}`,
          itemName: productName,
          unitPrice: item.sellingPrice || item.costPrice || 0,
          quantity: item.quantity,
          totalPrice: (item.sellingPrice || item.costPrice || 0) * item.quantity,
        });
      });
    }
  });
  return items;
}

export default function SaleTable({ sales }: { sales: SaleType[] }) {
  const grouped = useMemo(() => {
    const result: GroupedSales = {};
    VANS.forEach((van) => {
      result[van] = {};
    });

    sales.forEach((sale) => {
      const vanKey: string = (sale.vanNo as string) || 'Unfilled';
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
      {VANS.map((van) => {
        const vanData = grouped[van] || {};
        const vanSales = Object.values(vanData).flat();
        const flatItems = flattenSales(vanSales);
        const totalAmount = vanSales.reduce((sum, s) => sum + s.totalPrice, 0);
        const totalPaid = vanSales.reduce((sum, s) => sum + s.paid, 0);
        const totalDue = vanSales.reduce((sum, s) => sum + s.due, 0);

        return (
          <div
            key={van}
            className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden"
          >
            <div className={`bg-gradient-to-r ${getVanColor(van)} px-5 py-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Van {van}</h3>
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
                  const dayItems = flattenSales(dateSales);
                  const dayTotal = dateSales.reduce((sum, s) => sum + s.totalPrice, 0);
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
                        <table className="min-w-[500px] w-full text-sm">
                          <thead className="bg-slate-900/30 text-slate-500">
                            <tr>
                              <th className="px-5 py-2 text-left font-medium">Item</th>
                              <th className="px-3 py-2 text-right font-medium">Unit Price</th>
                              <th className="px-3 py-2 text-right font-medium">Qty</th>
                              <th className="px-3 py-2 text-right font-medium">Total</th>
                              <th className="px-3 py-2 text-center font-medium">Type</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/50">
                            {dayItems.map((item) => (
                              <tr key={item.itemId} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-5 py-2.5 text-slate-300 text-sm">
                                  {item.itemName}
                                </td>
                                <td className="px-3 py-2.5 text-right text-slate-400">
                                  ₹{item.unitPrice.toFixed(2)}
                                </td>
                                <td className="px-3 py-2.5 text-right text-slate-400">
                                  {item.quantity}
                                </td>
                                <td className="px-3 py-2.5 text-right text-slate-200 font-medium">
                                  ₹{item.totalPrice.toFixed(2)}
                                </td>
                                <td className="px-3 py-2.5 text-center">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    item.saleType === 'RETURN'
                                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  }`}>
                                    {item.saleType}
                                  </span>
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
