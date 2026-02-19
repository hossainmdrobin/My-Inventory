
export default function Pagination({ currentPage, setCurrentPage, totalPages }: { currentPage: number, setCurrentPage: (page: number) => void, totalPages: number }) {
    return (
        <div className="flex flex-wrap justify-end items-center gap-2">
            <button
                disabled={currentPage === 1}
                // onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 rounded-lg border border-slate-700 disabled:opacity-40"
            >
                Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-lg border ${currentPage === i + 1
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-slate-700"
                        }`}
                >
                    {i + 1}
                </button>
            ))}

            <button
                disabled={currentPage === totalPages}
                // onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 rounded-lg border border-slate-700 disabled:opacity-40"
            >
                Next
            </button>
        </div>)
}
