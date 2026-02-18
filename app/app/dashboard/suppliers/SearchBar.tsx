import React from 'react'

export default function SearchBar({search, setSearch, setCurrentPage}: {search: string, setSearch: React.Dispatch<React.SetStateAction<string>>, setCurrentPage: React.Dispatch<React.SetStateAction<number>>}) {
    return (
        <input
            type="text"
            placeholder="Search supplier..."
            value={search}
            onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
            }}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2 outline-none"
        />
    )
}
