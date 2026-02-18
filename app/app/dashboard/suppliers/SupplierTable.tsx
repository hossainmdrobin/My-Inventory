type Supplier = {
    id: number;
    name: string;
    phone: string;
    address: string;
    addedAt: string;
};
export default function SupplierTable({ paginatedSuppliers, openEditModal, handleDelete }: { paginatedSuppliers: Supplier[], openEditModal: (supplier: Supplier) => void, handleDelete: (id: number) => void }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="min-w-[900px] w-full text-sm">
                <thead className="bg-slate-900 text-slate-300">
                    <tr>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Phone</th>
                        <th className="p-3 text-left">Address</th>
                        <th className="p-3 text-left">Added</th>
                        <th className="p-3 text-center">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {paginatedSuppliers.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-4 text-center text-slate-400">
                                No suppliers found
                            </td>
                        </tr>
                    )}

                    {paginatedSuppliers.map((supplier) => (
                        <tr
                            key={supplier.id}
                            className="border-t border-slate-800 hover:bg-slate-900/50"
                        >
                            <td className="p-3">{supplier.name}</td>
                            <td className="p-3">{supplier.phone}</td>
                            <td className="p-3 max-w-xs truncate">
                                {supplier.address}
                            </td>
                            <td className="p-3">
                                {new Date(supplier.addedAt).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-center space-x-3">
                                <button
                                    onClick={() => openEditModal(supplier)}
                                    className="text-blue-400 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(supplier.id)}
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
