import { useCreateTransactionMutation } from "@/redux/slices/transaction/api.transaction";
import { BankAccount } from "@/types/bank";
import { useEffect, useState } from "react";

interface CashOutflowModalProps {
    open: boolean;
    banks: BankAccount[];
    onClose: () => void;
}

export default function CashTransferModal({
    open,
    banks,
    onClose,
}: CashOutflowModalProps) {
    const [createTransaction, { data, error }] = useCreateTransactionMutation()
    console.log("TRansaction data", data, error)

    useEffect(() => {
        if (data) {
            onClose();
        }
    }, [data, onClose]);

    const [sourceWallet, setSourceWallet] = useState<string>("")
    const [destinationWallet, setDestinationWallet] = useState<string>("")
    const [note, setNote] = useState("");
    const [amount, setAmount] = useState(0);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-lg rounded-xl bg-slate-900 p-6 space-y-4">
                <h2 className="text-xl font-semibold">Record Cash Outflow</h2>
                <p className="text-sm text-slate-400">Transfer money to another Account</p>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-400 mb-1 block">Fransfer From</label>
                        <select
                            value={sourceWallet}
                            onChange={(e) => setSourceWallet(e.target.value)}
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
                    <div>
                        <label className="text-sm text-slate-400 mb-1 block">Fransfer To</label>
                        <select
                            value={destinationWallet}
                            onChange={(e) => setDestinationWallet(e.target.value)}
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
                        onClick={() => createTransaction({ sourceWallet, destinationWallet, note, amount })}
                        disabled={!sourceWallet || !destinationWallet || amount <= 0}
                        className="px-4 py-2 rounded-lg bg-red-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Transfer Money
                    </button>
                </div>
            </div>
        </div>
    );
}