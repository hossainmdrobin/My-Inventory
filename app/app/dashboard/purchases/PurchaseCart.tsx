import { useState } from "react";
import SearchProduct from "./SearchProduct";
import { useDispatch } from "react-redux";
import { removeItem, resetPurchase, setDescription, setNote, setPaid, setQty, setSupplier } from "@/redux/slices/purchase/reducer.purchase";
import { Key, MessageCircleWarning, X } from "lucide-react";
import { PurchaseType } from "@/types/purchase";
import { useCreatePurchaseMutation } from "@/redux/slices/purchase/api.parchase";
import { useGetSuppliersQuery } from "@/redux/slices/api.slices";

export default function PurchaseCart({ selectedIds, purchase, setCartOpen }: { selectedIds: string[], purchase: PurchaseType, setCartOpen: (open: boolean) => void }) {
    const [open, setOpen] = useState(false);
    const [createPurchase] = useCreatePurchaseMutation()
    const [validData, setValidData] = useState<{ isValid: boolean, error?: string }>({ isValid: false });
    const { data: suppliers } = useGetSuppliersQuery({ key: "" })
    console.log(purchase)

    const dispatch = useDispatch();
    const proceedPurchase = () => {
        if (purchase.items.length === 0) {
            setValidData({ isValid: false, error: "No products selected" });
            return;
        }
        if(!purchase.supplier){
            setValidData({ isValid: false, error: "No Supplier Selected" });
            return ;
        }

        setValidData({ isValid: true });
        createPurchase({ data: purchase })
        dispatch(resetPurchase())
        setCartOpen(false);

    }


    return (
        <>
            {open && <SearchProduct setOpen={setOpen} selectedIds={selectedIds} />}

            <div className='bg-slate-900 border border-gray-200 rounded-xl border border-slate-800'>
                <h1 className='text-center text-lg font-semibold my-2'>Purchase Summary</h1> <hr />
                <div className='p-4 space-y-4 h-[400px] overflow-y-auto'>
                    <input
                        onChange={(e) => dispatch(setNote(e.target.value))}
                        type="text" placeholder='Purchase Note' className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2" />
                    <textarea
                        onChange={(e) => dispatch(setDescription(e.target.value))}
                        name="" id="" placeholder='Purchase Description' className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2" />
                    <div className="flex gap-4">
                        {suppliers && <select 
                        defaultValue={purchase.supplier}
                        onChange={(e)=>dispatch(setSupplier(e.target.value))}
                        name="" id="" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2">
                            <option value="">Select a Supplier</option>
                            {
                                suppliers?.map((supplier) => <option value={supplier._id}>{supplier.name}</option>)
                            }
                        </select>}
                        <button className="w-">Create Supplier</button>
                    </div>

                    <div className='w-full bg-slate-800 border border-slate-700 rounded-lg p-2'>
                        <div className="flex items-center justify-between mt-2 mb-4">
                            <h3 className=' text-lg'>Your selected Products</h3>
                            <button
                                onClick={() => setOpen(true)} className="px-4 py-2 rounded-lg bg-blue-600 font-semibold">Search Porduct</button>
                        </div>
                        <hr />
                        {purchase.items.length == 0 && <div className="text-yellow-400 h-[150px] text-center my-4 flex flex-col items-center justify-center">
                            <MessageCircleWarning className="" />
                            <span className="w-[5px] h-3"></span>

                            <span>Please Select a Product</span>
                        </div>}
                        {purchase?.items?.map((product) => (<>
                            <div className="flex items-center justify-between my-2">
                                <span className="px-1"><X className="text-red-500 cursor-pointer" onClick={() => dispatch(removeItem(product.productId))} /></span>
                                <div>{product.name}</div>
                                <div>Price: {product.costPrice}</div>
                                <div>Quantity:
                                    <input type="number"
                                        min={1}
                                        defaultValue={1}
                                        onChange={(e) => setQty({ productId: product.productId, quantity: Number(e.target.value) })}
                                        className="w-12 bg-slate-700 border border-slate-600 rounded-lg p-1" />

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
                    {suppliers && <select 
                        defaultValue={purchase.supplier}
                        onChange={(e)=>dispatch(setSupplier(e.target.value))}
                        name="" id="" className="my-3 w-full bg-slate-800 border border-slate-700 rounded-lg p-2">
                            <option value="cash">Select a Payment Method(Default Cash)</option>
                            <option value='bkash'>Bkash</option>
                            <option value='nagad'>Nagad</option>
                            <option value='islamic_bank'>Islamic Bank</option>
                            <option value='bank'>Bank</option>

                            
                        </select>}
                    {!validData.isValid && <p className="text-red-400">{validData.error}</p>}
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
