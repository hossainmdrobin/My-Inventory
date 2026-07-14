import { AggregatedProduct } from "@/types/product";

export default function SaleItemRow({ item }: { item: AggregatedProduct }) {
  return (
    <tr className="hover:bg-slate-800/30 transition-colors">
      <td className="px-3 py-2.5 text-slate-300 text-sm">{item.productName}</td>
      <td className="px-3 py-2.5 text-slate-400 text-xs">{item.sku}</td>
      <td className="px-3 py-2.5 text-slate-300 text-sm">{item.supplierName}</td>
      <td className="px-3 py-2.5 text-right text-slate-200">{item.openingQty}</td>
      <td className="px-3 py-2.5 text-right text-slate-400">{item.returnQty}</td>
      <td className="px-3 py-2.5 text-right text-slate-400 text-red-400/80">{item.damageQty}</td>
      <td className="px-3 py-2.5 text-right text-slate-200 font-medium">₹{item.totalPrice.toFixed(2)}</td>
    </tr>
  );
}
