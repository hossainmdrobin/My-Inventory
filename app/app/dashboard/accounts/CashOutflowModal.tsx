import { BankAccount } from "@/types/bank";
import { Supplier } from "@/types/supplier";
import { useState } from "react";
import { useCreateTransactionMutation } from "@/redux/slices/api.slices";

interface CashOutflowModalProps {
    open: boolean;
    banks: BankAccount[];
    suppliers: Supplier[];
    onClose: () => void;
}

export default function CashTransferModal({
    open,
    banks,
    suppliers,
    onClose,
}: CashOutflowModalProps) {
    const [destination, setDestination] = useState<"bank" | "supplier">("bank");
    const [selectedSupplier, setSelectedSupplier] = useState<string>("");
    const [selectedBank, setSelectedBank] = useState<string>("");
    const [sourceWallet, setSourceWallet] = useState<string>("");
    const [note, setNote] = useState("");
    const [amount, setAmount] = useState(0);

    const [createTransaction, { isLoading, error, isSuccess }] = useCreateTransactionMutation();

    const onSubmit = async () => {
        if (amount <= 0) return;
        if (!sourceWallet) return;
        if (destination === "bank" && !selectedBank) return;
        if (destination === "supplier" && !selectedSupplier) return;

        try {
            await createTransaction({
                amount,
                source: "cash_outflow",
                sourceWallet,
                destinationWallet: destination === "bank" ? selectedBank : undefined,
                destinationSupplier: destination === "supplier" ? selectedSupplier : undefined,
                note,
            }).unwrap();
            resetForm();
            onClose();
        } catch (err) {
            console.error("Failed to create transaction:", err);
        }
    };

    const resetForm = () => {
        setDestination("bank");
        setSelectedSupplier("");
        setSelectedBank("");
        setSourceWallet("");
        setNote("");
        setAmount(0);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!open) return null;

    const errorMessage = error
        ? (error as any)?.data?.error || (error as any)?.data?.message || "Failed to create transaction"
        : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-lg rounded-xl bg-slate-900 p-6 space-y-4">
                <h2 className="text-xl font-semibold">Record Cash Outflow</h2>
                <p className="text-sm text-slate-400">Transfer money from cash balance</p>

                {errorMessage && (
                    <div className="rounded-lg bg-red-900/50 border border-red-700 px-4 py-2 text-sm text-red-300">
                        {errorMessage}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-400 mb-1 block">Source Wallet</label>
                        <select
                            value={sourceWallet}
                            onChange={(e) => setSourceWallet(e.target.value)}
                            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                        >
                            <option value="">Select source wallet</option>
                            {banks.map((bank) => (
                                <option key={bank._id || bank.name} value={bank._id || ""}>
                                    {bank.name} - {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(bank.balance || 0)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-slate-400 mb-2 block">Destination Type</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setDestination("bank")}
                                className={`flex-1 px-4 py-2 rounded-lg border transition ${destination === "bank"
                                    ? "bg-blue-600 border-blue-600 text-white"
                                    : "border-slate-600 text-slate-300 hover:bg-slate-800"
                                    }`}
                            >
                                Bank Account
                            </button>
                            <button
                                onClick={() => setDestination("supplier")}
                                className={`flex-1 px-4 py-2 rounded-lg border transition ${destination === "supplier"
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
                                {banks.filter(b => b._id !== sourceWallet).map((bank) => (
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
                        onClick={handleClose}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg border border-slate-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={isLoading || (!selectedBank && destination === "bank") || (!selectedSupplier && destination === "supplier") || amount <= 0 || !sourceWallet}
                        className="px-4 py-2 rounded-lg bg-red-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Recording..." : "Record Outflow"}
                    </button>
                </div>
            </div>
        </div>
    );
}
