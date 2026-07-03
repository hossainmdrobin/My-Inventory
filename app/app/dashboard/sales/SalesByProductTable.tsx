import React, { useMemo } from 'react';
import { SaleType } from '@/types/sale';
import { flattenSales } from './SaleTable';

type AggregatedProduct = {
  sku: string;
  supplierName: string;
  productName: string;
  price: number;
  quantity: number;
  returns: number;
  totalReturn: number;
  totalSale: number;
};

export default function SalesByProductTable({ sales }: { sales: SaleType[] }) {
  const aggregatedProducts = useMemo(() => {
    if (!sales || sales.length === 0) return [];

    const flatItems = flattenSales(sales);
    const map: Record<string, AggregatedProduct> = {};

    flatItems.forEach((item) => {
      const key = item.sku || item.productName;
      if (!map[key]) {
        map[key] = {
          sku: item.sku,
          supplierName: item.supplierName,
          productName: item.productName,
          price: item.price,
          quantity: 0,
          returns: 0,
          totalReturn: 0,
          totalSale: 0,
        };
      }
      map[key].quantity += item.quantity;
      map[key].returns += item.returns;
      map[key].totalReturn += item.totalReturn;
      map[key].totalSale += item.totalSale;
    });

    return Object.values(map).sort((a, b) => b.quantity - a.quantity);
  }, [sales]);

  const totalQuantity = aggregatedProducts.reduce((sum, p) => sum + p.quantity, 0);
  const totalSale = aggregatedProducts.reduce((sum, p) => sum + p.totalSale, 0);

  if (!sales || sales.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
        <div className="text-slate-500 text-sm">No sales found</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Sales by Product</h3>
              <p className="text-white/70 text-xs">Total quantity across all vans</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold">Qty: {totalQuantity}</div>
            <div className="text-xs text-white/80">Total: ₹{totalSale.toFixed(2)}</div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-slate-900/30 text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left font-medium">SKU</th>
              <th className="px-3 py-2 text-left font-medium">Supplier name</th>
              <th className="px-3 py-2 text-left font-medium">Product name</th>
              <th className="px-3 py-2 text-right font-medium">Price</th>
              <th className="px-3 py-2 text-right font-medium">Quantity</th>
              <th className="px-3 py-2 text-right font-medium">Returns</th>
              <th className="px-3 py-2 text-right font-medium">Total Return</th>
              <th className="px-3 py-2 text-right font-medium">Total Sale</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {aggregatedProducts.map((product) => (
              <tr key={product.sku + product.productName} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-3 py-2.5 text-slate-400 text-xs">
                  {product.sku}
                </td>
                <td className="px-3 py-2.5 text-slate-300 text-sm">
                  {product.supplierName}
                </td>
                <td className="px-3 py-2.5 text-slate-300 text-sm">
                  {product.productName}
                </td>
                <td className="px-3 py-2.5 text-right text-slate-400">
                  ₹{product.price.toFixed(2)}
                </td>
                <td className="px-3 py-2.5 text-right text-slate-200 font-medium">
                  {product.quantity}
                </td>
                <td className="px-3 py-2.5 text-right text-slate-400">
                  {product.returns}
                </td>
                <td className="px-3 py-2.5 text-right text-slate-200 font-medium">
                  ₹{product.totalReturn.toFixed(2)}
                </td>
                <td className="px-3 py-2.5 text-right text-slate-200 font-medium">
                  ₹{product.totalSale.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
