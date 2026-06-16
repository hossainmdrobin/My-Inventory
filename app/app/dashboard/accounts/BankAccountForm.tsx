import { BankAccount } from "@/types/bank";
import { AccountTypeName, AccountCategory } from "@/types/others";

interface BankAccountFormProps {
    open: boolean;
    editing: BankAccount | null;
    form: Partial<BankAccount>;
    setForm: (form: Partial<BankAccount>) => void;
    onClose: () => void;
    onSubmit: () => void;
}

const accountTypeMap: Record<AccountCategory, AccountTypeName[]> = {
    Asset: ["Cash", "Bank", "Inventory", "Accounts Receivable", "Wallet"],
    Liability: ["Accounts Payable", "Loans"],
    Equity: ["Owner Capital"],
    Income: ["Sales", "Service Income"],
    Expense: ["Salary", "Rent", "Utilities"],
};

const categories: AccountCategory[] = ["Asset", "Liability", "Equity", "Income", "Expense"];

export default function BankAccountForm({ open, editing, form, setForm, onClose, onSubmit }: BankAccountFormProps) {
    if (!open) return null;

    console.log("Rendering BankAccountForm with form data:", form);

    const category = form.category || "Asset";
    const availableTypes = accountTypeMap[category] || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-lg rounded-xl bg-slate-900 p-6 space-y-4">
                <h2 className="text-xl font-semibold">
                    {editing ? "Edit Account" : "Add Account"}
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Account Name</label>
                        <input
                            placeholder="Enter account name"
                            value={form.name || ""}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Account Number (optional)</label>
                        <input
                            placeholder="Enter account number"
                            value={form.accountNumber || ""}
                            onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            value={form.category || "Asset"}
                            onChange={(e) => setForm({ ...form, category: e.target.value as AccountCategory, type: undefined })}
                            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Account Type</label>
                        <select
                            value={form.type || ""}
                            onChange={(e) => setForm({ ...form, type: e.target.value as AccountTypeName })}
                            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                        >
                            <option value="">Select Account Type</option>
                            {availableTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Initial Balance</label>
                        <input
                            placeholder="Enter initial balance"
                            type="number"
                            value={form.balance ?? 0}
                            onChange={(e) => setForm({ ...form, balance: Number(e.target.value) })}
                            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                        <textarea
                            placeholder="Enter notes"
                            value={form.notes || ""}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                            rows={3}
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
                        className="px-4 py-2 rounded-lg bg-blue-600 font-semibold"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
