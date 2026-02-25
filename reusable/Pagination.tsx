import React from 'react'

export default function Pagination({ pageNo, totalPages, setPageNo }: { pageNo: number; totalPages: number; setPageNo: (page: number) => void }) {
  return (
<div className="flex flex-wrap justify-end items-center gap-2">
          <button
            disabled={pageNo === 1}
            onClick={() => setPageNo(pageNo - 1)}
            className="px-3 py-1 rounded-lg border border-slate-700 disabled:opacity-40"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPageNo(i + 1)}
              className={`px-3 py-1 rounded-lg border ${
                pageNo === i + 1
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-slate-700"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={pageNo === totalPages}
            onClick={() => setPageNo(pageNo + 1)}
            className="px-3 py-1 rounded-lg border border-slate-700 disabled:opacity-40"
          >
            Next
          </button>
        </div>  )
}
