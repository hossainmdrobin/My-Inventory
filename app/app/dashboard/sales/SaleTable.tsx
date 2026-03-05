import React, { useEffect } from 'react'
import { Van } from 'lucide-react';
import { SaleType } from '@/types/sale';

export default function PurchaseTable({ sales }: {
    sales: SaleType[];
}) {
    // Redux hooks
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="min-w-[900px] w-full text-sm">
                <thead className="bg-slate-900 text-slate-300">
                    <tr>
                        <th>Date</th>
                        <th className="p-3 text-left">Note</th>
                        <th className='text-left'>Description</th>
                        <th className="p-3 text-right">Items</th>
                        <th>vehicle</th>
                        <th>Seller</th>
                        <th className="p-3 text-right">Total Price</th>
                        <th>Due</th>
                        <th className="p-3 text-right">Paid</th>
                        {/* <th className="p-3 text-left">Created By</th> */}
                        <th className="p-3 text-center">Status</th>
                    </tr>
                </thead>

                <tbody>
                    {sales.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-4 text-center text-slate-400">
                                No purchases found
                            </td>
                        </tr>
                    )}

                    {sales.map((sale) => (
                        <TableRow key={sale._id} sale={sale} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}


const TableRow = ({ sale }: { sale: SaleType }) => {
    const [itemString, setItemString] = React.useState("");
    useEffect(() => {
        if (sale.items && sale.items.length > 0) {
            const str = sale.items.map((item) => {
                const productName = typeof item.productId === 'string' ? item.productId : (item.productId as any)?.name;
                return `${productName} (x${item.quantity})`;
            }).join(", ");
            setItemString(str);
        }

    }, [sale.items])
    const { createdAt, vehicle, employee } = sale
    console.log(sale, "alesdf")
    return (
        <tr
            key={sale._id}
            className="border-t border-slate-800 hover:bg-slate-900/50"
        >
            {createdAt && <td className='px-2 border-r-[.1px]'>{new Date(createdAt).toLocaleDateString("en-GB") || ""}</td>}
            <td className="p-3 border-r-[.1px]">{sale.note || "No note"}</td>
            <td className="p-3 border-r-[.1px] max-w-[150px] truncate hover:whitespace-normal">{sale.description || "No description"}</td>
            <td className="p-3 border-r-[.1px] text-right max-w-[100px] truncate hover:whitespace-normal">{itemString}</td>
            <td className="p-3 border-r-[.1px] flex gap-1 items-center text-center justify-center text-white"><Van />{vehicle}</td>
            <td className='border-r-1 px-1'>{employee?.name? employee.name :"Not Provided"}</td>
            <td className="p-3 border-r-[.1px] text-right">{sale.totalPrice}</td>
            <td className="p-3 border-r-[.1px] text-right">{sale.due}</td>
            <td className="p-3 border-r-[.1px] text-right">{sale.paid}</td>
            <td className="p-3 text-center">
                {sale.due === 0 ? (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">Paid</span>
                ) : (
                    <>
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">Due</span>
                    </>
                )}
            </td>

            {/* <td className="p-3">{purchase.createdBy}</td> */}
        </tr>
    )
}