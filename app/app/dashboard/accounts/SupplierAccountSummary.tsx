import { Supplier } from "@/types/supplier";

interface SupplierAccountSummaryProps {
    suppliers: Supplier[];
    onRecordPayment: (supplier: Supplier) => void;
}

export default function SupplierAccountSummary({ suppliers, onRecordPayment }: SupplierAccountSummaryProps) {
    const totalPayable = suppliers.reduce((sum, s) => sum + (s.due || 0), 0);
    const totalPaid = suppliers.reduce((sum, s) => sum + (s.paid || 0), 0);
    const totalAdvance = suppliers.reduce((sum, s) => sum + (s.advance || 0), 0);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl bg-slate-900 p-4 border-l-4 border-red-500">
                    <p className="text-sm text-slate-400">Total Accounts Payable</p>
                    <p className="text-xl font-bold text-red-400">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalPayable)}
                    </p>
                </div>
                <div className="rounded-xl bg-slate-900 p-4 border-l-4 border-green-500">
                    <p className="text-sm text-slate-400">Total Paid to Suppliers</p>
                    <p className="text-xl font-bold text-green-400">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalPaid)}
                    </p>
                </div>
                <div className="rounded-xl bg-slate-900 p-4 border-l-4 border-yellow-500">
                    <p className="text-sm text-slate-400">Total Advance</p>
                    <p className="text-xl font-bold text-yellow-400">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalAdvance)}
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="min-w-[700px] w-full text-sm">
                    <thead className="bg-slate-900 text-slate-300">
                        <tr>
                            <th className="p-3 text-left">Supplier Name</th>
                            <th className="p-3 text-left">Phone</th>
                            <th className="p-3 text-right">Due</th>
                            <th className="p-3 text-right">Paid</th>
                            <th className="p-3 text-right">Advance</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-4 text-center text-slate-400">
                                    No suppliers found
                                </td>
                            </tr>
                        )}
                        {suppliers.map((supplier) => (
                            <tr key={supplier._id} className="border-t border-slate-800 hover:bg-slate-900/50">
                                <td className="p-3">{supplier.name}</td>
                                <td className="p-3">{supplier.phone}</td>
                                <td className="p-3 text-right text-red-400">
                                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(supplier.due || 0)}
                                </td>
                                <td className="p-3 text-right text-green-400">
                                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(supplier.paid || 0)}
                                </td>
                                <td className="p-3 text-right text-yellow-400">
                                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(supplier.advance || 0)}
                                </td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => onRecordPayment(supplier)}
                                        className="text-sm text-blue-400 hover:underline"
                                    >
                                        Record Payment
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}