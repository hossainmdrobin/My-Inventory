"use client";

import { useMemo, useState } from "react";

type ProductRow = {
  id: number;
  product: string;
  sku: string;
  category: string;
  stock: number;
  costPrice: number;
};

type SaleRow = {
  id: number;
  date: string; // ISO
  customer: string;
  items: number;
  amount: number;
  status: "Paid" | "Pending" | "Due";
  createdBy: string;
};

type PurchaseRow = {
  id: number;
  date: string; // ISO
  supplier: string;
  items: number;
  amount: number;
};

type Tab = "stock" | "sales" | "purchase";

const LOW_STOCK_THRESHOLD = 5;

function formatCurrency(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

/* ----------------- Mock data (replace with API) ----------------- */
const MOCK_PRODUCTS: ProductRow[] = [
  { id: 1, product: "T-Shirt A", sku: "TS-A-001", category: "Clothing", stock: 120, costPrice: 3.5 },
  { id: 2, product: "Sneakers B", sku: "SN-B-010", category: "Footwear", stock: 8, costPrice: 22.0 },
  { id: 3, product: "Cap C", sku: "CP-C-100", category: "Accessories", stock: 3, costPrice: 1.5 },
  { id: 4, product: "Jacket D", sku: "JK-D-020", category: "Clothing", stock: 0, costPrice: 18.0 },
  { id: 5, product: "Socks E", sku: "SK-E-007", category: "Clothing", stock: 42, costPrice: 0.8 },
];

const MOCK_SALES: SaleRow[] = [
  { id: 1, date: "2026-01-20", customer: "Alpha Store", items: 10, amount: 150, status: "Paid", createdBy: "Admin" },
  { id: 2, date: "2026-01-28", customer: "Beta Mart", items: 3, amount: 45, status: "Pending", createdBy: "Robin" },
  { id: 3, date: "2026-02-01", customer: "Gamma Shop", items: 5, amount: 80, status: "Paid", createdBy: "Admin" },
  { id: 4, date: "2026-02-04", customer: "Delta Co", items: 2, amount: 30, status: "Due", createdBy: "Robin" },
];

const MOCK_PURCHASES: PurchaseRow[] = [
  { id: 1, date: "2026-01-05", supplier: "Supplier A", items: 100, amount: 300 },
  { id: 2, date: "2026-01-30", supplier: "Supplier B", items: 20, amount: 220 },
  { id: 3, date: "2026-02-03", supplier: "Supplier C", items: 50, amount: 500 },
];

/* ----------------- Page ----------------- */
export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("stock");

  // Filters for sales & purchases
  const [salesStart, setSalesStart] = useState("");
  const [salesEnd, setSalesEnd] = useState("");
  const [purchStart, setPurchStart] = useState("");
  const [purchEnd, setPurchEnd] = useState("");

  /* ---------- STOCK SUMMARY CALCULATIONS ---------- */
  const products = useMemo(() => MOCK_PRODUCTS, []);
  const totalStockValue = useMemo(
    () => products.reduce((acc, p) => acc + p.stock * p.costPrice, 0),
    [products]
  );
  const totalProducts = products.length;
  const lowStockItems = useMemo(() => products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD), [products]);

  /* ---------- SALES FILTERING & CALCULATIONS ---------- */
  function dateInRange(dateIso: string, start?: string, end?: string) {
    const d = new Date(dateIso);
    if (start) {
      const s = new Date(start + "T00:00:00");
      if (d < s) return false;
    }
    if (end) {
      // include entire end day
      const e = new Date(end + "T23:59:59");
      if (d > e) return false;
    }
    return true;
  }

  const sales = useMemo(() => MOCK_SALES, []);
  const filteredSales = useMemo(
    () => sales.filter((s) => dateInRange(s.date, salesStart || undefined, salesEnd || undefined)),
    [sales, salesStart, salesEnd]
  );
  const totalSalesAmount = filteredSales.reduce((acc, s) => acc + s.amount, 0);
  const paidAmount = filteredSales.reduce((acc, s) => acc + (s.status === "Paid" ? s.amount : 0), 0);
  const unpaidAmount = totalSalesAmount - paidAmount;

  /* ---------- PURCHASES FILTERING & CALCULATIONS ---------- */
  const purchases = useMemo(() => MOCK_PURCHASES, []);
  const filteredPurchases = useMemo(
    () => purchases.filter((p) => dateInRange(p.date, purchStart || undefined, purchEnd || undefined)),
    [purchases, purchStart, purchEnd]
  );
  const totalPurchaseAmount = filteredPurchases.reduce((acc, p) => acc + p.amount, 0);

  /* ---------- Helpers ---------- */
  const clearSalesFilter = () => {
    setSalesStart("");
    setSalesEnd("");
  };
  const clearPurchFilter = () => {
    setPurchStart("");
    setPurchEnd("");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Reports</h1>

      {/* Tabs */}
      <div className="flex gap-2">
        <TabBtn label="Stock Summary" active={activeTab === "stock"} onClick={() => setActiveTab("stock")} />
        <TabBtn label="Sales Report" active={activeTab === "sales"} onClick={() => setActiveTab("sales")} />
        <TabBtn label="Purchase History" active={activeTab === "purchase"} onClick={() => setActiveTab("purchase")} />
      </div>

      {/* Tab content */}
      {activeTab === "stock" && (
        <section className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard title="Total Stock Value" value={formatCurrency(totalStockValue)} />
            <SummaryCard title="Total Products" value={String(totalProducts)} />
            <SummaryCard title="Low Stock Items" value={String(lowStockItems.length)} tone={lowStockItems.length > 0 ? "warn" : "ok"} />
          </div>

          {/* Low stock quick list */}
          <div className="rounded-lg bg-slate-900 p-4 border border-slate-800">
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
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
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
          </div>
        </section>
      )}

      {activeTab === "sales" && (
        <section className="space-y-6">
          {/* Filter row */}
          <div className="flex flex-col sm:flex-row gap-3 items-end justify-between">
            <div className="flex gap-3 items-end">
              <div>
                <label className="block text-sm text-slate-300">Start</label>
                <input value={salesStart} onChange={(e) => setSalesStart(e.target.value)} type="date" className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-slate-300">End</label>
                <input value={salesEnd} onChange={(e) => setSalesEnd(e.target.value)} type="date" className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" />
              </div>
              <div>
                <button onClick={clearSalesFilter} className="rounded-lg border border-slate-700 px-3 py-2">Clear filter</button>
              </div>
            </div>

            {/* Summary cards */}
            <div className="flex gap-3">
              <SummaryCard title="Total Sales" value={formatCurrency(totalSalesAmount)} />
              <SummaryCard title="Paid Amount" value={formatCurrency(paidAmount)} />
              <SummaryCard title="Unpaid Amount" value={formatCurrency(unpaidAmount)} tone={unpaidAmount > 0 ? "warn" : "ok"} />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="min-w-[1000px] w-full text-sm">
              <thead className="bg-slate-900 text-slate-300">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-right">Items</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Created By</th>
                </tr>
              </thead>

              <tbody>
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-slate-400">No sales for the selected range</td>
                  </tr>
                ) : (
                  filteredSales.map((s) => (
                    <tr key={s.id} className="border-t border-slate-800 hover:bg-slate-900/50">
                      <td className="p-3">{new Date(s.date).toLocaleDateString()}</td>
                      <td className="p-3">{s.customer}</td>
                      <td className="p-3 text-right">{s.items}</td>
                      <td className="p-3 text-right">{formatCurrency(s.amount)}</td>
                      <td className="p-3"><StatusBadge status={s.status} /></td>
                      <td className="p-3">{s.createdBy}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "purchase" && (
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
              <SummaryCard title="Total Purchase" value={formatCurrency(totalPurchaseAmount)} />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="bg-slate-900 text-slate-300">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Supplier</th>
                  <th className="p-3 text-right">Items</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>

              <tbody>
                {filteredPurchases.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-400">No purchases for the selected range</td>
                  </tr>
                ) : (
                  filteredPurchases.map((p) => (
                    <tr key={p.id} className="border-t border-slate-800 hover:bg-slate-900/50">
                      <td className="p-3">{new Date(p.date).toLocaleDateString()}</td>
                      <td className="p-3">{p.supplier}</td>
                      <td className="p-3 text-right">{p.items}</td>
                      <td className="p-3 text-right">{formatCurrency(p.amount)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

/* ----------------- Small subcomponents ----------------- */

function TabBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-t-lg -mb-px border-b-2 ${
        active ? "border-blue-600 text-blue-600 bg-slate-900" : "border-transparent text-slate-400 bg-transparent"
      }`}
    >
      {label}
    </button>
  );
}

function SummaryCard({ title, value, tone = "normal" }: { title: string; value: string; tone?: "normal" | "warn" | "ok" }) {
  const toneClass = tone === "warn" ? "bg-yellow-900/40 border-yellow-700" : tone === "ok" ? "bg-green-900/40 border-green-700" : "bg-slate-900/40 border-slate-800";
  return (
    <div className={`rounded-lg p-4 border ${toneClass}`}>
      <div className="text-sm text-slate-300">{title}</div>
      <div className="mt-2 text-lg font-semibold">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let cls = "bg-slate-700/40 text-slate-200";
  if (status === "Paid" || status === "OK") cls = "bg-green-500/20 text-green-400";
  if (status === "Pending") cls = "bg-yellow-500/20 text-yellow-400";
  if (status === "Due" || status === "Out of Stock" || status === "Low") cls = "bg-red-500/20 text-red-400";
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>{status}</span>;
}
