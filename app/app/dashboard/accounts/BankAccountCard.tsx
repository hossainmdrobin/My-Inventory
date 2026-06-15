import { BankAccount } from "@/types/bank";

interface BankAccountCardProps {
    bank: BankAccount;
    onEdit?: (bank: BankAccount) => void;
    onDelete?: (id: string) => void;
}

export default function BankAccountCard({ bank, onEdit, onDelete }: BankAccountCardProps) {
    const balance = typeof bank.balance === "number"
        ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(bank.balance)
        : bank.balance;

    const categoryColors: Record<string, string> = {
        Asset: "bg-green-900/50 text-green-400",
        Liability: "bg-red-900/50 text-red-400",
        Equity: "bg-blue-900/50 text-blue-400",
        Income: "bg-purple-900/50 text-purple-400",
        Expense: "bg-orange-900/50 text-orange-400",
    };

    return (
        <div className="rounded-xl bg-slate-900 p-5 border border-slate-800 hover:bg-slate-800/50 transition">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">{bank.name}</h3>
                    {bank.accountNumber && <p className="text-sm text-slate-400">{bank.accountNumber}</p>}
                </div>
                <div className="flex flex-col gap-1 items-end">
                    <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[bank.category] || "bg-slate-800 text-slate-300"}`}>
                        {bank.category}
                    </span>
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-sm text-slate-400">{bank.accountType}</p>
            </div>
            <div className="space-y-2 mt-2">
                <p className="text-sm text-slate-400">Balance</p>
                <p className="text-xl font-bold text-green-400">{balance}</p>
            </div>
            {bank.notes && (
                <p className="mt-3 text-xs text-slate-500 line-clamp-2">{bank.notes}</p>
            )}
            <div className="flex gap-3 mt-4 pt-3 border-t border-slate-800">
                {onEdit && <button
                    onClick={() => onEdit && onEdit(bank)}
                    className="text-sm text-blue-400 hover:underline"
                >
                    Edit
                </button>}
                {onDelete && <button
                    onClick={() => bank._id && onDelete(bank._id)}
                    className="text-sm text-red-400 hover:underline"
                >
                    Delete
                </button>}
            </div>
        </div>
    );
}
