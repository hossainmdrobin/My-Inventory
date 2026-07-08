import { X } from "lucide-react";

import { setQty, removeItem } from "@/redux/slices/sales/reducer.sale";
import { SaleItemType } from "@/types/sale";
import { useDispatch } from "react-redux";
import { useState } from "react";

interface ITEM{
    quantity: number;
    price: number;
}


export default function SaleCartCard({ product }: { product: SaleItemType }) {

    const [cost,setCost] = useState<ITEM[]>([{ quantity: 1, price: product.costPrice }])
    console.log(cost)
    const dispatch = useDispatch()

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value > Number(product.quantity)) dispatch(setQty({ productId: product.productId, quantity: value }))
    }
    return (
            <tr key={product.productId} className="border-b border-gray-700">
                <td className="w-20"><X className="text-red-500 cursor-pointer" onClick={() => dispatch(removeItem(product.productId))} /></td>
                <td>{product.name}</td>
                {/* <span>{product.stock}</span> */}
                <td>Supplier</td>
                <div>{product.costPrice}</div>
                <td>
                    {cost.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input className="bg-gray-600" type="number"
                                min={1}
                                max={product.stock}
                                defaultValue={item.quantity}
                                onChange={(e) => {
                                    const newCost = [...cost];
                                    newCost[index] = { ...item, quantity: Number(e.target.value) };
                                    setCost(newCost);
                                }}
                            />
                            <input type="number"
                                min={1}
                                max={product.stock}
                                defaultValue={item.price}
                                onChange={(e) => {
                                    const newCost = [...cost];
                                    newCost[index] = { ...item, price: Number(e.target.value) };
                                    setCost(newCost);
                                }}
                            />
                            <span>300</span>
                        </div>
                    ))}
                    <button
                        onClick={() => setCost([...cost, { quantity: 1, price: product.sellingPrice ?? product.costPrice }])}
                        className="bg-green-800 my-1"
                    >Add Row</button>
                </td>
                <td>
                    4
                </td>
            </tr>

    )
}
