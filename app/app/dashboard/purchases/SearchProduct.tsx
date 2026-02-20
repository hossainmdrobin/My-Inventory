import { useGetProductsQuery } from '@/redux/slices/product'
import React, { useState } from 'react'
import { SearchCard } from './Cards';

export default function SearchProduct() {
    const [key, setKey] = useState("")

    const {data, isLoading} = useGetProductsQuery({key});
    console.log(data)
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
                <div className='h-[600px] overflow-y-auto'>
                    {
                        data?.map(product=><SearchCard key={product._id} {...product} />)
                    }
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        className="px-4 py-2 rounded-lg border border-slate-600"
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded-lg bg-blue-600 font-semibold"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    )
}
