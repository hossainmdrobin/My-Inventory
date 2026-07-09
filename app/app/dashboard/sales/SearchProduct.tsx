import { useGetProductsQuery, } from '@/redux/slices/product'
import { useState } from 'react'
import { SearchCard } from './Cards';

export default function SearchProduct({ selectedIds, setOpen }: { selectedIds: string[], setOpen: (open: boolean) => void }) {
    const [key, setKey] = useState("")

    const { data, isLoading } = useGetProductsQuery({ key });
    return (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50'>
            <div className='w-full flex flex-col max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 h-[600px] shadow-2xl'>
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-200">Search Products</h2>
                    <input
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        type="text"
                        placeholder="Search products..."
                        className="w-[300px] rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 outline-none text-slate-200 placeholder-slate-500 focus:border-blue-500 transition-colors"
                    />
                </div>
                {isLoading && <div className='text-center text-slate-400 flex items-center justify-center py-4'>Loading...</div>}
                
                <div className='flex-1 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/30'>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-900/80 text-slate-400 sticky top-0 backdrop-blur-sm border-b border-slate-800">
                            <tr>
                                <th className="p-3 font-semibold">SKU</th>
                                <th className="p-3 font-semibold">Product Name</th>
                                <th className="p-3 font-semibold">Company</th>
                                <th className="p-3 text-center font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {
                                Array.isArray(data) && data.map(product => (
                                    <SearchCard
                                        key={product._id}
                                        {...product}
                                        selectedIds={selectedIds}
                                    />
                                ))
                            }
                        </tbody>
                    </table>
                    {Array.isArray(data) && data.length === 0 && !isLoading && (
                        <div className="text-center text-slate-500 py-12">No products found</div>
                    )}
                </div>
                
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={() => setOpen(false)}
                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-white cursor-pointer transition-colors shadow-lg shadow-blue-600/20"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    )
}
