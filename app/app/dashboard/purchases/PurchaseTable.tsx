import React, { useEffect } from 'react'
import { PurchaseType } from '@/types/purchase';
import { Table } from 'lucide-react';

export default function PurchaseTable({ paginatedPurchases }: {
    paginatedPurchases: PurchaseType[];
}) {
    // Redux hooks
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="min-w-[900px] w-full text-sm">
                <thead className="bg-slate-900 text-slate-300">
                    <tr>
                        <th className="p-3 text-left">Note</th>
                        <th className='max-w-[20px] text-left'>Description</th>
                        <th className="p-3 text-right">Items</th>
                        <th className="p-3 text-right">Total Price</th>
                        <th>Due</th>
                        <th className="p-3 text-right">Paid</th>
                        {/* <th className="p-3 text-left">Created By</th> */}
                        <th className="p-3 text-center">Status</th>
                    </tr>
                </thead>

                <tbody>
                    {paginatedPurchases.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-4 text-center text-slate-400">
                                No purchases found
                            </td>
                        </tr>
                    )}

                    {paginatedPurchases.map((purchase) => (
                        <TableRow key={purchase._id} purchase={purchase} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}


const TableRow = ({ purchase }: { purchase: PurchaseType }) => {
    const [itemString, setItemString] = React.useState("");
    useEffect(() => {
        if (purchase.items && purchase.items.length > 0) {
            const str = purchase.items.map((item) => {
                const productName = typeof item.productId === 'string' ? item.productId : (item.productId as any)?.name;
                return `${productName} (x${item.quantity})`;
            }).join(", ");
            setItemString(str);
        }

    }, [purchase.items])
    return (
        <tr
            key={purchase._id}
            className="border-t border-slate-800 hover:bg-slate-900/50"
        >
            <td className="p-3">{purchase.note || "No note"}</td>
            <td className="p-3 max-w-[200px] truncate hover:whitespace-normal">{purchase.description || "No description"}</td>
            {/* <td className="p-3">{purchase.supplier}</td> */}
            <td className="p-3 text-right max-w-[100px] truncate hover:whitespace-normal">{itemString}</td>
            <td className="p-3 text-right">{purchase.totalPrice}</td>
            <td className="p-3 text-right">{purchase.due}</td>
            <td className="p-3 text-right">{purchase.paid}</td>
            <td className="p-3 text-center">
                {purchase.due === 0 ? (
                    <span className="text-green-400">Paid</span>
                ) : (
                    <>
                        <button className="text-blue-400 hover:text-blue-300">Mark as Paid</button>

                    </>
                )}
            </td>

            {/* <td className="p-3">{purchase.createdBy}</td> */}
        </tr>
    )
}