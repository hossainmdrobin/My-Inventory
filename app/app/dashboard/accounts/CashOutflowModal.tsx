import { BankAccount } from "@/types/bank";
import { Supplier } from "@/types/supplier";

interface CashOutflowModalProps {
    open: boolean;
    banks: BankAccount[];
    suppliers: Supplier[];
    destination: "bank" | "supplier";
    selectedBank: string;
    selectedSupplier: string;
    amount: number;
    note: string;
    setDestination: (dest: "bank" | "supplier") => void;
    setSelectedBank: (bankId: string) => void;
    setSelectedSupplier: (supplierId: string) => void;
    setAmount: (amount: number) => void;
    setNote: (note: string) => void;
    onClose: () => void;
    onSubmit: () => void;
}

export default function CashOutflowModal({
    open,
    banks,
    suppliers,
    destination,
    selectedBank,
    selectedSupplier,
    amount,
    note,
    setDestination,
    setSelectedBank,
    setSelectedSupplier,
    setAmount,
    setNote,
    onClose,
    onSubmit
}: CashOutflowModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-lg rounded-xl bg-slate-900 p-6 space-y-4">
                <h2 className="text-xl font-semibold">Record Cash Outflow</h2>
                <p className="text-sm text-slate-400">Transfer money from cash balance</p>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-400 mb-2 block">Destination Type</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setDestination("bank")}
                                className={`flex-1 px-4 py-2 rounded-lg border transition ${
                                    destination === "bank"
                                        ? "bg-blue-600 border-blue-600 text-white"
                                        : "border-slate-600 text-slate-300 hover:bg-slate-800"
                                }`}
                            >
                                Bank Account
                            </button>
                            <button
                                onClick={() => setDestination("supplier")}
                                className={`flex-1 px-4 py-2 rounded-lg border transition ${
                                    destination === "supplier"
                                        ? "bg-blue-600 border-blue-600 text-white"
                                        : "border-slate-600 text-slate-300 hover:bg-slate-800"
                                }`}
                            >
                                Supplier
                            </button>
                        </div>
                    </div>

                    {destination === "bank" && (
                        <div>
                            <label className="text-sm text-slate-400 mb-1 block">Destination Bank Account</label>
                            <select
                                value={selectedBank}
                                onChange={(e) => setSelectedBank(e.target.value)}
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                            >
                                <option value="">Select a bank account</option>
                                {banks.map((bank) => (
                                    <option key={bank._id || bank.name} value={bank._id || ""}>
                                        {bank.name} - {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(bank.balance || 0)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {destination === "supplier" && (
                        <div>
                            <label className="text-sm text-slate-400 mb-1 block">Pay To</label>
                            <select
                                value={selectedSupplier}
                                onChange={(e) => setSelectedSupplier(e.target.value)}
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                            >
                                <option value="">Select a supplier</option>
                                {suppliers.map((supplier) => (
                                    <option key={supplier._id || supplier.name} value={supplier._id || ""}>
                                        {supplier.name} - Due: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(supplier.accountPayable || 0)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="text-sm text-slate-400 mb-1 block">Amount</label>
                        <input
                            placeholder="Enter amount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-slate-400 mb-1 block">Purpose / Note</label>
                        <input
                            placeholder="e.g., Transfer, payment for goods, expenses"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                        />
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
                        disabled={(!selectedBank && destination === "bank") || (!selectedSupplier && destination === "supplier") || amount <= 0}
                        className="px-4 py-2 rounded-lg bg-red-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Record Outflow
                    </button>
                </div>
            </div>
        </div>
    );
}