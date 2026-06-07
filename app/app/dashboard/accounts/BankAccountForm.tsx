import { BankAccount } from "@/types/bank";
import { BankAccountType } from "@/types/others";

interface BankAccountFormProps {
    open: boolean;
    editing: BankAccount | null;
    form: Partial<BankAccount>;
    setForm: (form: Partial<BankAccount>) => void;
    onClose: () => void;
    onSubmit: () => void;
}

const accountTypes: BankAccountType[] = ["Checking", "Savings", "Business", "Other"];

export default function BankAccountForm({ open, editing, form, setForm, onClose, onSubmit }: BankAccountFormProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-lg rounded-xl bg-slate-900 p-6 space-y-4">
                <h2 className="text-xl font-semibold">
                    {editing ? "Edit Bank Account" : "Add Bank Account"}
                </h2>

                <div className="space-y-4">
                    <input
                        placeholder="Bank Name"
                        value={form.name || ""}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                    />

                    <input
                        placeholder="Account Number"
                        value={form.accountNumber || ""}
                        onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                    />

                    <select
                        value={form.type || "Checking"}
                        onChange={(e) => setForm({ ...form, type: e.target.value as BankAccountType })}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                    >
                        {accountTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    <input
                        placeholder="Initial Balance"
                        type="number"
                        value={form.balance ?? 0}
                        onChange={(e) => setForm({ ...form, balance: Number(e.target.value) })}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                    />

                    <textarea
                        placeholder="Notes (optional)"
                        value={form.notes || ""}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                        rows={3}
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
                        className="px-4 py-2 rounded-lg bg-blue-600 font-semibold"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}