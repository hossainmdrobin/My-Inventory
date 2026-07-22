import { AggregatedProduct } from "@/types/product";

export default function SaleItemRow({ item }: { item: AggregatedProduct }) {
  return (
    <tr className="hover:bg-slate-800/30 transition-colors">
      <td className="px-3 py-2.5 text-slate-300 text-sm">{item.productName}</td>
      <td className="px-3 py-2.5 text-slate-400 text-xs">{item.sku}</td>
      <td className="px-3 py-2.5 text-slate-300 text-sm">{item.supplierName}</td>
      <td className="px-3 py-2.5 text-right text-slate-200">{item.openingQty}</td>
      <td className="px-3 py-2.5 text-right text-slate-400">{item.returnQty}</td>
      <td className="px-3 py-2.5 text-right text-slate-400">{item.openingQty-item.returnQty}</td>
      <td className="px-3 py-2.5 text-right text-slate-400 text-red-400/80">{item.damageQty}</td>
      <td className="px-3 py-2.5 text-left text-slate-200 font-medium">৳ {item.totalPrice.toFixed(2)}</td>
      <td className="px-3 py-2.5 text-left text-slate-200 font-medium">৳ {item.return}</td>
      <td className="px-3 py-2.5 text-left text-slate-200">৳ {item.commission.toFixed(2)}</td>
    </tr>
  );
}
