import { useDeleteSupplierMutation } from "@/redux/slices/api.slices";
import { Employee } from "@/types/employee";
import { Types } from "mongoose";

export default function CustomerTable({ paginatedSuppliers, openEditModal, handleDelete }: { paginatedSuppliers: Employee[], openEditModal: (customer: Employee) => void, handleDelete: (id: string) => void }) {

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

                    {paginatedSuppliers.map((employee,i) => (
                        <tr
                            key={i}
                            className="border-t border-slate-800 hover:bg-slate-900/50"
                        >
                            <td className="p-3">{employee.name}</td>
                            <td className="p-3">{employee.phone}</td>
                            <td className="p-3 max-w-xs truncate">
                                {employee.address}
                            </td>
                            <td className="p-3">
                                {employee?.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="p-3  text-center flex items-center justify-center space-x-3">
                                <button
                                    onClick={() => openEditModal(employee)}
                                    className="text-blue-400 hover:underline"
                                >
                                    Edit
                                </button>
                                {employee._id && <DeleteButton id={employee._id} />}


                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}


function DeleteButton({ id }: { id: string | Types.ObjectId }) {
    const [deleteSupplier, { isLoading }] = useDeleteSupplierMutation()

    return (
        <>
            {!isLoading && <button
                // onClick={() => id && deleteSupplier({ id })}
                className="text-red-400 hover:underline"
            >
                Delete
            </button>}
            {isLoading && <button className="flex items-center justify-center space-x-1">
                <span className="w-2 h-2 bg-purple-800 rounded-full animate-bounce delay-0"></span>
                <span className="w-2 h-2 bg-yellow-800 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-green-800 rounded-full animate-bounce delay-300"></span>
            </button>}

        </>
    )
}

