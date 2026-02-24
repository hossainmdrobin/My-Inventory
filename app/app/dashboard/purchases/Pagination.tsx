import React from 'react'

export default function Pagination({ pageData,totalPages,setPagData }: {
    pageData: {page: number, limit: number};
    setPagData: (params: {page: number,limit?:number}) => void;
    totalPages: Number;
}) {
  console.log(totalPages, "heheeh;s")
  return (
<div className="flex flex-wrap justify-end items-center gap-2">
          <button
            disabled={pageData.page === 1}
            // onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 rounded-lg border border-slate-700 disabled:opacity-40"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPagData({...pageData, page: i + 1 })}
              className={`px-3 py-1 rounded-lg border ${
                pageData.page === i + 1
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-slate-700"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={pageData.page === totalPages}
            onClick={() => setPagData({...pageData, page: pageData.page + 1 })}
            className="px-3 py-1 rounded-lg border border-slate-700 disabled:opacity-40"
          >
            Next
          </button>
        </div>  )
}
