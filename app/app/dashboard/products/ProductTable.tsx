import { useDeleteProductMutation } from '@/redux/slices/product'
import React from 'react'

export default function ProductTable({ paginatedProducts, openEditModal }: { paginatedProducts: any[], openEditModal: (product: any) => void}) {

    const [deleteProduct,{data}] = useDeleteProductMutation()
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="min-w-[900px] w-full text-sm">
                <thead className="bg-slate-900 text-slate-300">
                    <tr>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Supplier</th>
                        <th className="p-3 text-right">Cost Price</th>
                        <th className="p-3 text-right">Selling Price</th>
                        <th className="p-3 text-right">Stock</th>
                        <th className="p-3 text-center">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {paginatedProducts.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-4 text-center text-slate-400">
                                No products found
                            </td>
                        </tr>
                    )}

                    {paginatedProducts.map((product) => (
                        <tr
                            key={product._id}
                            className="border-t border-slate-800 hover:bg-slate-900/50"
                        >
                            <td className="p-3">{product.name}</td>
                            <td className="p-3">{`${product?.supplier?.name }` || "N/A"}</td>
                            <td className="p-3 text-right">{product.costPrice}</td>
                            <td className="p-3 text-right">{product.sellingPrice}</td>
                            <td className="p-3 text-right">{product.stock}</td>
                            <td className="p-3 text-center space-x-3">
                                <button
                                    onClick={() => openEditModal(product)}
                                    className="text-blue-400 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteProduct({id:product._id})}
                                    className="text-red-400 hover:underline"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>)
}
