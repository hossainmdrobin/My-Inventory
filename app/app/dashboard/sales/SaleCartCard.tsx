import { X } from "lucide-react";

import { setQty, removeItem } from "@/redux/slices/sales/reducer.sale";
import { SaleItemType } from "@/types/sale";
import { useDispatch } from "react-redux";


export default function SaleCartCard({ product }: { product: SaleItemType }) {
    const dispatch = useDispatch()

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value > Number(product.quantity)) dispatch(setQty({ productId: product.productId, quantity: value }))
    }
    return (
        <>
            <tr key={product.productId} className="flex items-center justify-between my-2">
                <td><X className="text-red-500 cursor-pointer" onClick={() => dispatch(removeItem(product.productId))} /></td>
                <td>{product.name}</td>
                {/* <span>{product.stock}</span> */}
                <td>Supplier</td>
                <div>{product.costPrice}</div>
                <td>
                    <input type="number"
                        min={1}
                        max={product.stock}
                        defaultValue={1}
                        onChange={handleOnChange}
                        className="w-12 bg-slate-700 border border-slate-600 rounded-lg p-1" />
                </td>
                <td>
                    4
                </td>
            </tr>
            <hr />
        </>

    )
}