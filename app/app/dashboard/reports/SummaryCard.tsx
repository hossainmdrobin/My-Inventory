import React from 'react'

export default function SummaryCard({ title, value, tone = "normal" }: { title: string; value: string; tone?: "normal" | "warn" | "ok" }) {
    const toneClass = tone === "warn" ? "bg-yellow-900/40 border-yellow-700" : tone === "ok" ? "bg-green-900/40 border-green-700" : "bg-slate-900/40 border-slate-800";
    return (
        <div className={`rounded-lg p-4 border ${toneClass}`}>
            <div className="text-sm text-slate-300">{title}</div>
            <div className="mt-2 text-lg font-semibold">{value}</div>
        </div>
    );
}
