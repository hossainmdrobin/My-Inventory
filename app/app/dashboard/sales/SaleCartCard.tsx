import { X } from "lucide-react";

import { setQty, removeItem, setDetailQuantity } from "@/redux/slices/sales/reducer.sale";
import { SaleItemType } from "@/types/sale";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

interface ITEM {
    quantity: number;
    price: number;
}


export default function SaleCartCard({ product }: { product: SaleItemType }) {

    const [cost, setCost] = useState<ITEM[]>([{ quantity: 1, price: product.sellingPrice }])
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setDetailQuantity({ 
            productId: product.productId, 
            quantity: cost.reduce((acc, item) => acc + item.quantity, 0),
            detailQuantity: cost, 
            totalPrice: cost.reduce((acc, item) => acc + item.quantity * item.price, 0), 
            comission: cost.reduce((acc, item) => acc + (item.quantity * (product.sellingPrice ?? product.costPrice) - item.quantity * item.price), 0),
        }))
    }, [cost])
    return (
        <tr key={product.productId} className="border-b border-gray-700">
            <td className="w-20"><X className="text-red-500 cursor-pointer" onClick={() => dispatch(removeItem(product.productId))} /></td>
            <td>{product.name}</td>
            {/* <span>{product.stock}</span> */}
            <td>Supplier</td>
            <td>{product.sellingPrice}</td>
            <td>
                <table className="w-full">
                    <tbody className="m-2">
                        <tr className="border-b border-gray-700">
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Comission</th>
                        </tr>
                        {cost.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-600">
                                <td><input type="number"
                                    min={1}
                                    defaultValue={item.price}
                                    maxLength={8}
                                    onChange={(e) => {
                                        const newCost = [...cost];
                                        newCost[index] = { ...item, price: Number(e.target.value) };
                                        setCost(newCost);
                                    }}
                                /></td>
                                <td className=""><input className="" type="number"
                                    min={1}
                                    max={product.stock}
                                    defaultValue={item.quantity}
                                    onChange={(e) => {
                                        const newCost = [...cost];
                                        newCost[index] = { ...item, quantity: Number(e.target.value) };
                                        setCost(newCost);
                                    }}
                                /></td>
                                <td>{item.quantity * item.price}</td>
                                <td>{item.quantity * (product.sellingPrice) - item.quantity * item.price}</td>
                            </tr>
                        ))}
                        
                    </tbody>
                </table>

                <button
                    onClick={() => setCost([...cost, { quantity: 1, price: product.sellingPrice ?? product.costPrice }])}
                    className="px-3 py-1 my-2 rounded-lg bg-blue-600 font-semibold"
                >+Add Row</button>
            </td>
            <td className="text-center">
                {cost.reduce((acc, item) => acc + (item.quantity * (product.sellingPrice ?? product.costPrice) - item.quantity * item.price), 0)}
            </td>
        </tr>

    )
}
