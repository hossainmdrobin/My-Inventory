interface FinancialSummaryCardProps {
    title: string;
    amount: number | string;
    currency?: string;
    subtitle?: string;
}

export default function FinancialSummaryCard({ title, amount, currency = "USD", subtitle }: FinancialSummaryCardProps) {
    const displayAmount = typeof amount === "number" 
        ? new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2 }).format(amount)
        : amount;

    return (
        <div className="rounded-xl bg-slate-900 p-6 border-l-6 border-blue-500">
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            {subtitle && <p className="text-xs text-slate-500 mb-2">{subtitle}</p>}
            <p className="text-2xl font-bold text-white">{displayAmount}</p>
        </div>
    );
}