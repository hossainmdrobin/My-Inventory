import React from 'react'

export default function PurchaseTable({ paginatedPurchases, handleDelete }: {
    paginatedPurchases: {
        id: number;
        name: string;
        supplier: string;
        items: number;
        totalPrice: number;
        createdBy: string;
    }[];
    handleDelete: (id: number) => void;
}) {
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="min-w-[900px] w-full text-sm">
                <thead className="bg-slate-900 text-slate-300">
                    <tr>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Supplier</th>
                        <th className="p-3 text-right">Items</th>
                        <th className="p-3 text-right">Total Price</th>
                        <th className="p-3 text-left">Created By</th>
                        <th className="p-3 text-center">Actions</th>
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
                        <tr
                            key={purchase.id}
                            className="border-t border-slate-800 hover:bg-slate-900/50"
                        >
                            <td className="p-3">{purchase.name}</td>
                            <td className="p-3">{purchase.supplier}</td>
                            <td className="p-3 text-right">{purchase.items}</td>
                            <td className="p-3 text-right">{purchase.totalPrice}</td>
                            <td className="p-3">{purchase.createdBy}</td>
                            <td className="p-3 text-center">
                                <button
                                    onClick={() => handleDelete(purchase.id)}
                                    className="text-red-400 hover:underline"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
