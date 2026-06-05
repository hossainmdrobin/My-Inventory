
export default function overviewCard({ text, value }: { text: string, value: string }) {
    return (
        <div className="rounded-r-xl bg-slate-900 p-6 border-l-6 border-yellow-500">
            <p className="text-center text-sm text-gray-400">{text}</p>
            <p className="text-2xl font-bold text-center">{value}</p>
        </div>
    )
}
