import { useGetProductsQuery, } from '@/redux/slices/product'
import { useState } from 'react'
import { SearchCard } from './Cards';
import { useGetSuppliersQuery } from '@/redux/slices/api.slices';

export default function SearchSupplier({ selectedIds, setOpen }: { selectedIds: string[], setOpen: (open: boolean) => void }) {
    const [key, setKey] = useState("")

    const { data, isLoading } = useGetSuppliersQuery({ key });

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='w-full flex flex-col max-w-md rounded-xl bg-slate-900 p-6 space-y-4 h-[600px]'>

                <input
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    type="text"
                    placeholder="Search products..."
                    className="w-[400px] rounded-lg bg-slate-900 border border-slate-700 px-4 py-2 outline-none"
                />
                {isLoading && <div className='text-center flex items-center justify-center'>Loading...</div>}
                <>
                    <div className='h-[600px] overflow-y-auto'>
                        {/* {
                            Array.isArray(data) && data.map(product => <SearchCard
                                 key={product._id}
                                  {...product}
                                  selectedIds={selectedIds}
                                   />)
                        } */}
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                        onClick={()=>setOpen(false)}
                        
                            className="px-4 py-2 rounded-lg bg-blue-600 font-semibold cursor-pointer"
                        >
                            Done
                        </button>
                    </div>
                </>
            </div>
        </div>
    )
}
