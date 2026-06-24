"use client";

import { FilterValues } from "@/types/others";
import { SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";



export default function PurchaseFilters({ filters, setFilters }: { filters: FilterValues; setFilters: (filters: FilterValues) => void }) {
  const [expanded, setExpanded] = useState(false);
  const updateFilter = (key: keyof FilterValues, value: any) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
  };

  useEffect(() => {
    if (filters.dateMode === "single" && filters.startDate) {
      updateFilter("endDate", filters.startDate);
    } else if (filters.dateMode === "month" && filters.startDate) {
      const date = new Date(filters.startDate);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split("T")[0];
      updateFilter("endDate", lastDay);
    }
  }, [filters.dateMode, filters.startDate]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
      <h2
        onClick={() => setExpanded(!expanded)}
        className="text-sm font-semibold text-slate-200">Filters <SlidersHorizontal className={`inline ml-2 ${expanded ? 'text-green-400' : 'text-slate-500'}`} /></h2>
      {expanded && <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 📅 Date Mode */}
          <div className="flex flex-col">
            <label className="text-xs text-slate-400 mb-1">Filter By</label>
            <select
              value={filters.dateMode}
              onChange={(e) => updateFilter("dateMode", e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2"
            >
              <option value="range">Date Range</option>
              <option value="single">Single Date</option>
              <option value="month">Month</option>
            </select>
          </div>

          {/* 📅 Start Date / Single Date / Month */}
          <div className="flex flex-col">
            <label className="text-xs text-slate-400 mb-1">
              {filters.dateMode === "month" ? "Month" : filters.dateMode === "single" ? "Date" : "Start Date"}
            </label>
            <input
              type={filters.dateMode === "month" ? "month" : "date"}
              value={filters.startDate}
              onChange={(e) => updateFilter("startDate", e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2"
            />
          </div>

          {/* 📅 End Date (only for range mode) */}
          {filters.dateMode === "range" && (
            <div className="flex flex-col">
              <label className="text-xs text-slate-400 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                min={filters.startDate}
                onChange={(e) => updateFilter("endDate", e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2"
              />
            </div>
          )}

          {/* 🔍 Search */}
          <div className="flex flex-col">
            <label className="text-xs text-slate-400 mb-1">Search</label>
            <input
              type="text"
              placeholder="Note or description..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 📊 Status */}
          <div className="flex flex-col">
            <label className="text-xs text-slate-400 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2"
            >
              <option value="">All</option>
              <option value="due">Due</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <label className="text-xs text-slate-400">Records per page</label>
          <select
            value={filters.limit}
            onChange={(e) => updateFilter("limit", Number(e.target.value))}
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </>}
    </div>
  );
}