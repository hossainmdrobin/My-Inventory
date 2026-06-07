import { Supplier } from "@/types/supplier";

interface SupplierAccountSummaryProps {
    suppliers: Supplier[];
    onRecordPayment: (supplier: Supplier) => void;
    onUpdateBalances: (supplier: Supplier) => void;
}

export default function SupplierAccountSummary({ suppliers, onRecordPayment, onUpdateBalances }: SupplierAccountSummaryProps) {
    const totalAccountPayable = suppliers.reduce((sum, s) => sum + (s.accountPayable || 0), 0);
    const totalAccountReceivable = suppliers.reduce((sum, s) => sum + (s.accountReceivable || 0), 0);

    const showCalculations = totalAccountPayable !== 0 || totalAccountReceivable !== 0;

    return (
        <div className="space-y-6">
            {showCalculations && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl bg-slate-900 p-4 border-l-4 border-red-500">
                        <p className="text-sm text-slate-400">Total Accounts Payable</p>
                        <p className="text-xl font-bold text-red-400">
                            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalAccountPayable)}
                        </p>
                    </div>
                    <div className="rounded-xl bg-slate-900 p-4 border-l-4 border-green-500">
                        <p className="text-sm text-slate-400">Total Accounts Receivable</p>
                        <p className="text-xl font-bold text-green-400">
                            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalAccountReceivable)}
                        </p>
                    </div>
                </div>
            )}

            {suppliers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suppliers.map((supplier) => (
                        <div
                            key={supplier._id}
                            className="rounded-xl bg-slate-900 p-4 border border-slate-800 hover:bg-slate-900/80 transition-colors"
                        >
                            <div className="space-y-3">
                                <div>
                                    <h3 className="font-semibold text-slate-200">{supplier.name}</h3>
                                    <p className="text-sm text-slate-400">{supplier.phone}</p>
                                    {supplier.address && (
                                        <p className="text-xs text-slate-500 mt-1">{supplier.address}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                                    <div>
                                        <p className="text-xs text-slate-400">Accounts Payable</p>
                                        <p className="text-sm font-medium text-red-400">
                                            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(supplier.accountPayable || 0)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Accounts Receivable</p>
                                        <p className="text-sm font-medium text-green-400">
                                            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(supplier.accountReceivable || 0)}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onRecordPayment(supplier)}
                                    className="w-full text-sm text-center text-blue-400 hover:underline py-2"
                                >
                                    Record Payment
                                </button>

                                <button
                                    onClick={() => onUpdateBalances(supplier)}
                                    className="w-full text-sm text-center text-slate-400 hover:text-slate-200 py-1"
                                >
                                    Update Balances
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-slate-800 p-6 text-center text-slate-400">
                    No suppliers found
                </div>
            )}
        </div>
    );
}