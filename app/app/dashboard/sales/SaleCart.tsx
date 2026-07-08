import { useState } from "react";
import { useDispatch } from "react-redux";
import {resetSale, setDescription, setNote, setPaid, setVanNo, setSaleType } from "@/redux/slices/sales/reducer.sale";
import { MessageCircleWarning } from "lucide-react";
import { SaleItemType, SaleType } from "@/types/sale";
import { useCreateSaleMutation } from "@/redux/slices/sales/api.sale";
import SearchProduct from "./SearchProduct";
import { useGetMeQuery } from "@/redux/slices/auth/api.auth";
import { vans } from "@/lib/lib_objects/vans"
import SaleCartCard from "./SaleCartCard";

export default function SaleCart({ selectedIds, sale, setCartOpen }: { selectedIds: string[], sale: SaleType, setCartOpen: (open: boolean) => void }) {
    const { data: profile } = useGetMeQuery()
    const [open, setOpen] = useState(false);
    const [createSale] = useCreateSaleMutation()
    const [validData, setValidData] = useState<{ isValid: boolean, error?: string }>({ isValid: false });
    const dispatch = useDispatch();
    const proceedSale = () => {
        if (sale.items.length === 0) {
            setValidData({ isValid: false, error: "No products selected" });
            return;
        }
        const data = { ...sale, institute: profile?.institute?._id }
        setValidData({ isValid: true });
        createSale({ data })
        dispatch(resetSale())
        setCartOpen(false);
    }

    return (
        <>
            {open && <SearchProduct setOpen={setOpen} selectedIds={selectedIds} />}

            <div className='bg-slate-900 border border-gray-200 rounded-xl border border-slate-800'>
                <h1 className='text-center text-lg font-semibold my-2'>Sale Summary</h1> <hr />
                <div className='p-4 space-y-4 h-[480px] overflow-y-auto'>
                    <select
                        onChange={(e) => dispatch(setSaleType(e.target.value))}
                        className="my-3 w-full text-gray-400 bg-slate-800 border border-slate-700 rounded-lg p-2"
                    >
                        <option value="SALE">Opening</option>
                        <option value="RETURN">Return</option>
                        <option value="DAMAGE">Damage</option>
                    </select>
                    <select
                        onChange={(e) => dispatch(setVanNo(e.target.value))}
                        className="my-3 w-full text-gray-400 bg-slate-800 border border-slate-700 rounded-lg p-2"
                    >
                        {
                            vans.map((van) => (
                                <option key={van.vanNo} value={van.vanNo}>{van.name}</option>
                            ))
                        }
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
                        {/* <div className="flex items-center justify-between">
                            <div> </div>
                            <div>Name</div>
                            <div>Stock</div>
                            <div>Price</div>
                            <div>Quentity</div>
                            <div>Commition</div>
                        </div> */}
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Product</th>
                                    <th>Supplier</th>
                                    <th>Selling Price</th>
                                    {/* <th>Quantity</th> */}
                                    <th>Quantity and Price</th>
                                    <th align="center">Total Comission</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sale?.items?.map((product: SaleItemType) => (
                                    <SaleCartCard product={product} />
                                ))}
                            </tbody>
                        </table>

                    </div>
                    <hr />
                    Total Cost Price: {sale.totalPrice}<br />
                    PAID COST: <input onChange={(e) => dispatch(setPaid(Number(e.target.value)))} defaultValue={sale.totalPrice} type="number" placeholder="Paid cost" className=" bg-slate-800 border border-slate-700 rounded-lg p-2 mt-2" /><br />
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


