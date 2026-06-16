import { BankAccount } from "@/types/bank";
import BankAccountCard from "./BankAccountCard";

interface BankAccountTableProps {
    accounts: BankAccount[];
    onSave?: (id: string, data: Partial<BankAccount>) => void;
    onDelete?: (id: string) => void;
}

export default function BankAccountTable({ accounts, onSave, onDelete }: BankAccountTableProps) {
    if (accounts.length === 0) {
        return (
            <div className="rounded-xl bg-slate-900 p-8 border border-slate-800 text-center">
                <p className="text-slate-400">No bank accounts found</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => (
                <BankAccountCard
                    key={account._id}
                    bank={account}
                    onSave={onSave}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}