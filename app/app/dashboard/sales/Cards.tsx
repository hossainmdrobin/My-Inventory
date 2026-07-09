import { selectItem } from "@/redux/slices/sales/reducer.sale";
import { Product } from "@/types/product";
import { useDispatch } from "react-redux";

export function SearchCard({ name, costPrice, _id, sellingPrice, selectedIds, stock, supplier, sku }: Product & { selectedIds: string[] }) {
    const dispatch = useDispatch();
    const supplierName = typeof supplier === 'object' && supplier !== null ? supplier.name : (supplier ?? '');
    return (
        <tr
            onClick={() => dispatch(selectItem({ productId: _id || "", name, costPrice: costPrice ?? 0, sellingPrice: sellingPrice ?? 0, stock: stock || 0, supplier: supplierName || '' }))}
            className="border-b border-slate-800 hover:bg-slate-800/40 cursor-pointer transition-colors"
        >
            <td className="p-3 text-slate-400 font-mono text-xs">{sku || '-'}</td>
            <td className="p-3 text-slate-200 font-medium">{name}</td>
            <td className="p-3 text-slate-300">{supplierName || '-'}</td>
            <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                <input
                    type="checkbox"
                    checked={selectedIds.includes(_id || "")}
                    onChange={() => dispatch(selectItem({ productId: _id || "", name, costPrice: costPrice ?? 0, sellingPrice: sellingPrice ?? 0, stock: stock || 0, supplier: supplierName || '' }))}
                    className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 cursor-pointer h-4 w-4"
                />
            </td>
        </tr>
    )
}

