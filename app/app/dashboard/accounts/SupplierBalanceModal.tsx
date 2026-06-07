import { Supplier } from "@/types/supplier";

interface SupplierBalanceModalProps {
    open: boolean;
    supplier: Supplier | null;
    accountPayable: number;
    accountReceivable: number;
    setAccountPayable: (value: number) => void;
    setAccountReceivable: (value: number) => void;
    onClose: () => void;
    onSubmit: () => void;
}

export default function SupplierBalanceModal({
    open,
    supplier,
    accountPayable,
    accountReceivable,
    setAccountPayable,
    setAccountReceivable,
    onClose,
    onSubmit,
}: SupplierBalanceModalProps) {
    if (!open || !supplier) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-md rounded-xl bg-slate-900 p-6 space-y-4">
                <h2 className="text-xl font-semibold">Update Supplier Balances</h2>
                <p className="text-sm text-slate-400">For: {supplier.name}</p>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-400">Accounts Payable</label>
                        <input
                            placeholder="Accounts Payable"
                            type="number"
                            value={accountPayable}
                            onChange={(e) => setAccountPayable(Number(e.target.value))}
                            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                        />
                        <p className="text-xs text-slate-500 mt-1">Amount owed to this supplier</p>
                    </div>

                    <div>
                        <label className="text-sm text-slate-400">Accounts Receivable</label>
                        <input
                            placeholder="Accounts Receivable"
                            type="number"
                            value={accountReceivable}
                            onChange={(e) => setAccountReceivable(Number(e.target.value))}
                            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                        />
                        <p className="text-xs text-slate-500 mt-1">Amount owed to you by this supplier</p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-slate-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        className="px-4 py-2 rounded-lg bg-blue-600 font-semibold"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}