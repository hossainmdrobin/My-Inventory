import { Supplier } from "@/types/supplier";

interface PaymentModalProps {
    open: boolean;
    supplier: Supplier | null;
    amount: number;
    note: string;
    setAmount: (amount: number) => void;
    setNote: (note: string) => void;
    onClose: () => void;
    onSubmit: () => void;
}

export default function PaymentModal({
    open,
    supplier,
    amount,
    note,
    setAmount,
    setNote,
    onClose,
    onSubmit
}: PaymentModalProps) {
    if (!open || !supplier) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-md rounded-xl bg-slate-900 p-6 space-y-4">
                <h2 className="text-xl font-semibold">Record Payment</h2>
                <p className="text-sm text-slate-400">For: {supplier.name}</p>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-400">Outstanding Due</label>
                        <p className="text-lg font-bold text-red-400">
                            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(supplier.due || 0)}
                        </p>
                    </div>

                    <input
                        placeholder="Payment Amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                    />

                    <textarea
                        placeholder="Note (optional)"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                        rows={2}
                    />
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
                        className="px-4 py-2 rounded-lg bg-green-600 font-semibold"
                    >
                        Record Payment
                    </button>
                </div>
            </div>
        </div>
    );
}