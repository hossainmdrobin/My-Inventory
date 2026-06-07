import { useState } from "react";
import { useDispatch } from "react-redux";
import {removeItem, resetSale, setDescription, setNote, setPaid, setQty, setVanNo } from "@/redux/slices/sales/reducer.sale";
import { MessageCircleWarning, X } from "lucide-react";
import { SaleItemType, SaleType } from "@/types/sale";
import { useCreateSaleMutation } from "@/redux/slices/sales/api.sale";
import SearchProduct from "./SearchProduct";

export default function SaleCart({ selectedIds, sale, setCartOpen }: { selectedIds: string[], sale: SaleType, setCartOpen: (open: boolean) => void }) {
    const [open, setOpen] = useState(false);
    const [createSale] = useCreateSaleMutation()
    const [validData, setValidData] = useState<{ isValid: boolean, error?: string }>({ isValid: false });
console.log(sale,"the sale")
    const dispatch = useDispatch();
    const proceedSale = () => {
        if (sale.items.length === 0) {
            setValidData({ isValid: false, error: "No products selected" });
            return;
        }

        setValidData({ isValid: true });
        createSale({ data: sale })
        dispatch(resetSale())
        setCartOpen(false);
    }

    return (
        <>
            {open && <SearchProduct setOpen={setOpen} selectedIds={selectedIds} />}

            <div className='bg-slate-900 border border-gray-200 rounded-xl border border-slate-800'>
                <h1 className='text-center text-lg font-semibold my-2'>Sale Summary</h1> <hr />
                <div className='p-4 space-y-4 h-[400px] overflow-y-auto'>
                    <select
                        onChange={(e) => dispatch(setVanNo(e.target.value))}
                        className="my-3 w-full text-gray-400 bg-slate-800 border border-slate-700 rounded-lg p-2"
                    >
                        <option value="1">Van 1</option>
                        <option value="2">Van 2</option>
                        <option value="3">Van 3</option>
                        <option value="4">Van 4</option>
                    </select>
                    <input
                        onChange={(e) => dispatch(setNote(e.target.value))}
                        type="text" placeholder='Sale Note' className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2" />
                    <textarea
                        onChange={(e) => dispatch(setDescription(e.target.value))}
                        name="" id="" placeholder='Sale Description' className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2" />
                    <div className='w-full bg-slate-800 border border-slate-700 rounded-lg p-2'>
                        <div className="flex items-center justify-between mt-2 mb-4">
                            <h3 className=' text-lg'>Your selected Products</h3>
                            <button
                                onClick={() => setOpen(true)} className="px-4 py-2 rounded-lg bg-blue-600 font-semibold">Search Porduct</button>
                        </div>
                        <hr />
                        {sale.items.length == 0 && <div className="text-yellow-400 h-[150px] text-center my-4 flex flex-col items-center justify-center">
                            <MessageCircleWarning className="" />
                            <span className="w-[5px] h-3"></span>

                            <span>Please Select a Product</span>
                        </div>}
                        {sale?.items?.map((product) => <SaleCartCard product={product} />)}

                    </div>
                    <hr />
                    Total Cost Price: {sale.totalPrice}<br />
                    PAID COST: <input onChange={(e) => dispatch(setPaid(Number(e.target.value)))} type="number" placeholder="Paid cost" className=" bg-slate-800 border border-slate-700 rounded-lg p-2 mt-2" /><br />
                    DUE COST: {sale.totalPrice - sale.paid > 0 ? sale.totalPrice - sale.paid : 0}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => setCartOpen(false)}
                            className="px-4 py-2 rounded-lg border border-slate-600"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => proceedSale()}
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


function SaleCartCard({ product }: { product: SaleItemType }) {
    const dispatch = useDispatch()

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value > Number(product.quantity)) dispatch(setQty({ productId: product.productId, quantity: value }))
    }
    return (
        <>
            <div key={product.productId} className="flex items-center justify-between my-2">
                <span><X className="text-red-500 cursor-pointer" onClick={() => dispatch(removeItem(product.productId))} /></span>
                <div>{product.name}</div>
                <span>Stock:{product.stock}</span>
                <div>Price: {product.costPrice}</div>
                <div>Quantity:
                    <input type="number"
                        min={1}
                        max={product.stock}
                        defaultValue={1}
                        onChange={handleOnChange}
                        className="w-12 bg-slate-700 border border-slate-600 rounded-lg p-1" />
                </div>
            </div>
            <hr />
        </>

    )
}