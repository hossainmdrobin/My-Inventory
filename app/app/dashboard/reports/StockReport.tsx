import { DashboardReport } from '@/types/report';
import SummaryCard from './SummaryCard';

export default function StockReport({ totalCostValue, totalProducts, totalSellingValue, lowStockItems }: DashboardReport) {
  return (
    <section className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <SummaryCard title="Total Stock Cost Value" value={"৳ " + (totalCostValue || 0).toString()} />
        <SummaryCard title="Total Stock Selling Value" value={"৳ " + (totalSellingValue || 0).toString()} />
        <SummaryCard title="Total Products" value={(totalProducts || 0).toString()} />
        <SummaryCard title="Low Stock Items" value={(lowStockItems || 0).toString()} tone={lowStockItems > 0 ? "warn" : "ok"} />
      </div>

      {/* Low stock quick list */}
      {/* <div className="rounded-lg bg-slate-900 p-4 border border-slate-800">
        <h3 className="font-semibold mb-2">Low stock items (≤ {LOW_STOCK_THRESHOLD})</h3>
        {lowStockItems.length === 0 ? (
          <p className="text-slate-400">No low stock items.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {lowStockItems.map((p) => (
              <li key={p.id} className="flex justify-between">
                <span>{p.product} ({p.sku})</span>
                <span className="text-slate-300">Stock: {p.stock}</span>
              </li>
            ))}
          </ul>
        )}
      </div> */}

      {/* Table */}
      {/* <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-[1000px] w-full text-sm">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">SKU</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-right">Stock</th>
              <th className="p-3 text-right">Cost Price</th>
              <th className="p-3 text-right">Stock Value</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-slate-400">No products</td>
              </tr>
            ) : (
              products.map((p) => {
                const stockValue = p.stock * p.costPrice;
                const status = p.stock === 0 ? "Out of Stock" : p.stock <= LOW_STOCK_THRESHOLD ? "Low" : "OK";
                return (
                  <tr key={p.id} className="border-t border-slate-800 hover:bg-slate-900/50">
                    <td className="p-3">{p.product}</td>
                    <td className="p-3">{p.sku}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3 text-right">{p.stock}</td>
                    <td className="p-3 text-right">{formatCurrency(p.costPrice)}</td>
                    <td className="p-3 text-right">{formatCurrency(stockValue)}</td>
                    <td className="p-3">
                      <StatusBadge status={status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div> */}
    </section>
  )
}
