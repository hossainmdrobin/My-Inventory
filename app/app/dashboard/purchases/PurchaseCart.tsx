import { useState } from "react";
import SearchProduct from "./SearchProduct";
import { useDispatch } from "react-redux";
import { decreamentQty, increamentQty, removeItem, resetPurchase, setDescription, setNote, setPaid, setQty } from "@/redux/slices/purchase/reducer.purchase";
import { X } from "lucide-react";
import { PurchaseType } from "@/types/purchase";
import { create } from "domain";
import { useCreatePurchaseMutation } from "@/redux/slices/purchase/api.parchase";

export default function PurchaseCart({ selectedIds, purchase, setCartOpen }: { selectedIds: string[], purchase: PurchaseType, setCartOpen: (open: boolean) => void }) {
    const [open, setOpen] = useState(false);
    const [createPurchase, { data, isLoading, error }] = useCreatePurchaseMutation()
    const [validData, setValidData] = useState<{ isValid: boolean, error?: string }>({ isValid: false });

    const dispatch = useDispatch();
    const proceedPurchase = () => {
        console.log("Proceeding with purchase:", purchase.items.length);
        if (purchase.items.length === 0) {
            setValidData({ isValid: false, error: "No products selected" });
            return;
        }
        console.log("Proceeding with purchase:", purchase);

        setValidData({ isValid: true });
        createPurchase({ data: purchase })
        dispatch(resetPurchase())
        setCartOpen(false);

    }

    console.log("Purchase Submit response", data, isLoading, error, validData);

    return (
        <>
            {open && <SearchProduct setOpen={setOpen} selectedIds={selectedIds} />}

            <div className='bg-slate-900 border border-gray-200 rounded-xl border border-slate-800'>
                <h1 className='text-center text-lg font-semibold'>Purchase Summary</h1> <hr />
                <div className='p-4 space-y-4 h-[400px] overflow-y-auto'>
                    <input
                        onChange={(e) => dispatch(setNote(e.target.value))}
                        type="text" placeholder='Purchase Note' className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2" />
                    <textarea
                        onChange={(e) => dispatch(setDescription(e.target.value))}
                        name="" id="" placeholder='Purchase Description' className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2" />
                    <div className='w-full bg-slate-800 border border-slate-700 rounded-lg p-2'>
                        <div className="flex items-center justify-between mt-2 mb-4">
                            <h3 className=' text-lg'>Your selected Products</h3>
                            <button
                                onClick={() => setOpen(true)} className="px-4 py-2 rounded-lg bg-blue-600 font-semibold">Search Porduct</button>
                        </div>
                        <hr />
                        {purchase?.items?.map((product) => (<>
                            <div className="flex items-center justify-between my-2">
                                <span><X className="text-red-500 cursor-pointer" onClick={() => dispatch(removeItem(product.productId))} /></span>
                                <div>{product.name}</div>
                                <div>Price: {product.costPrice}</div>
                                <div>Quantity:
                                    <button
                                        onClick={() => dispatch(decreamentQty(product.productId))}
                                        className="px-2 py-1 font-bold text-white bg-blue-600 rounded-l-lg">-</button>
                                    <input type="number"
                                        value={product.quantity}
                                        onChange={(e) => setQty({ productId: product.productId, quantity: Number(e.target.value) })}
                                        className="w-12 bg-slate-700 border border-slate-600 rounded-lg p-1" />

                                    <button onClick={() => dispatch(increamentQty(product.productId))} className="px-2 py-1 font-bold text-white bg-blue-600 rounded-r-lg">+</button>
                                </div>
                            </div>
                            <hr />
                        </>
                        ))}

                    </div>
                    <hr />
                    Total Cost Price: {purchase.totalPrice}<br />
                    PAID COST: <input onChange={(e) => dispatch(setPaid(Number(e.target.value)))} type="number" placeholder="Paid cost" className=" bg-slate-800 border border-slate-700 rounded-lg p-2 mt-2" /><br />
                    DUE COST: {purchase.totalPrice - purchase.paid > 0 ? purchase.totalPrice - purchase.paid : 0}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => setCartOpen(false)}
                            className="px-4 py-2 rounded-lg border border-slate-600"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => proceedPurchase()}
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
