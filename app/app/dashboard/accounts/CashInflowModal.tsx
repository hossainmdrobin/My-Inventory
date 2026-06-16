import { BankAccount } from "@/types/bank";

interface CashInflowModalProps {
    open: boolean;
    banks: BankAccount[];
    amount: number;
    selectedBank: string;
    note: string;
    setAmount: (amount: number) => void;
    setSelectedBank: (bankId: string) => void;
    setNote: (note: string) => void;
    onClose: () => void;
    onSubmit: () => void;
}

export default function CashInflowModal({
    open,
    banks,
    amount,
    selectedBank,
    note,
    setAmount,
    setSelectedBank,
    setNote,
    onClose,
    onSubmit
}: CashInflowModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-md rounded-xl bg-slate-900 p-6 space-y-4">
                <h2 className="text-xl font-semibold">Record Cash Inflow</h2>
                <p className="text-sm text-slate-400">Add money to your cash balance</p>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-400 mb-1 block">Destination Account</label>
                        <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                        >
                            <option value="">Select a bank account</option>
                            {banks.map((bank) => (
                                <option key={bank._id || bank.name} value={bank._id || ""}>
                                    {bank.name} ({bank.accountNumber})
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
                        <label className="text-sm text-slate-400 mb-1 block">Source / Note</label>
                        <input
                            placeholder="e.g., Sales revenue, investment, loan"
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
                        disabled={!selectedBank || amount <= 0}
                        className="px-4 py-2 rounded-lg bg-green-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Record Inflow
                    </button>
                </div>
            </div>
        </div>
    );
}