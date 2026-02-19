import React from 'react'

export default function SearchBar({search, setSearch}: {search: string, setSearch: React.Dispatch<React.SetStateAction<string>>}) {
    return (
        <input
            type="text"
            placeholder="Search supplier..."
            value={search}
            onChange={(e) => {
                setSearch(e.target.value);
            }}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2 outline-none"
        />
    )
}
