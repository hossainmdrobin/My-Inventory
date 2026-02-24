"use client";

import { CalendarDays } from "lucide-react";
import { DateRange } from "@/types/others";


type Props = {
  onChange?: (range: DateRange) => void;
};

export default function DateRangePicker({range,setRange}:{range:DateRange,setRange:(range:DateRange)=>void}) {
  

  const handleChange = (key: keyof DateRange, value: string) => {
    const updated = { ...range, [key]: value };
    setRange(updated);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg w-full max-w-xl">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-slate-400" />
        <h2 className="text-sm font-semibold text-slate-200">
          Select Date Range
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date */}
        <div className="flex flex-col">
          <label className="text-xs text-slate-400 mb-1">Start Date</label>
          <input
            type="date"
            value={range.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                       transition-all"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="text-xs text-slate-400 mb-1">End Date</label>
          <input
            type="date"
            value={range.endDate}
            min={range.startDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                       transition-all"
          />
        </div>
      </div>
    </div>
  );
}