import { selectItem } from "@/redux/slices/sales/reducer.sale";
import { Product } from "@/types/product";
import { useDispatch } from "react-redux";

export function SearchCard({ name, costPrice, _id, sellingPrice, selectedIds ,stock}: Product & { selectedIds: string[] }) {
    const dispatch = useDispatch();

    return (
        <div
            onClick={() => dispatch(selectItem({ productId: _id || "", name, costPrice: costPrice ?? 0, sellingPrice: sellingPrice ?? 0 ,stock:stock}))}
            className="flex items-center justify-between p-2 border-b border-slate-700 cursor-pointer hover:bg-slate-800"
        >
            <div>{name}</div>
            <div>Cost Price(BDT): {costPrice}</div>
            <div><input checked={selectedIds.includes(_id || "")} className="rounded" type="checkbox" /></div>
        </div>
    )
}

