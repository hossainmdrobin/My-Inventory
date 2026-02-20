import { div } from "framer-motion/client";
import { useState } from "react";
import SearchProduct from "./SearchProduct";

export default function PurchaseCart() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <SearchProduct />

            <div className='bg-slate-900 border border-gray-200 rounded-xl border border-slate-800'>
                <h1 className='text-center text-lg font-semibold'>Purchase Summary</h1> <hr />
                <div className='p-4 space-y-4 h-[400px] overflow-y-auto'>
                    <input type="text" placeholder='Purchase Note' className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2" />
                    <textarea name="" id="" placeholder='Purchase Description' className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2" />
                    <div className='w-full bg-slate-800 border border-slate-700 rounded-lg p-2'>
                        <div className="flex items-center justify-between mt-2 mb-4">
                            <h3 className=' text-lg'>Your selected Products</h3>
                            <button className="px-4 py-2 rounded-lg bg-blue-600 font-semibold">Search Porduct</button>
                        </div>
                        <hr />
                        <div className="flex items-center justify-between mt-2">
                            <div>Name</div>
                            <div>Price: 12</div>
                            <div>Count:
                                <button className="px-2 py-1 font-bold text-white bg-blue-600 rounded-l-lg">-</button>
                                12
                                <button className="px-2 py-1 font-bold text-white bg-blue-600 rounded-r-lg">+</button>
                            </div>
                        </div>
                        <hr />
                        <div className="flex items-center justify-between mt-2">
                            <div>Name</div>
                            <div>Count:
                                <button className="px-2 py-1 font-bold text-white bg-blue-600 rounded-l-lg">-</button>
                                12
                                <button className="px-2 py-1 font-bold text-white bg-blue-600 rounded-r-lg">+</button>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            className="px-4 py-2 rounded-lg border border-slate-600"
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 rounded-lg bg-blue-600 font-semibold"
                        >
                            Proceed
                        </button>
                    </div>
                </div>

            </div>
        </>
    )
}
