import { SaleItemType,SaleType } from "@/types/sale"
import { Trash } from "lucide-react"
import { useState, useEffect } from "react"

type quantityDetail = {
    quantity: number
    price: number
}
export default function DetailedQuantity({
    item,
    index,
    draft,
    setDraft,
}: {
    item: SaleItemType
    index: number
    draft: SaleType
    setDraft: (draft: SaleType) => void
}) {
    const [newQuantity, setNewQuantity] = useState<quantityDetail[]>(item.detailQuantity)
    useEffect(() => {
        const updatedItems = [...draft.items]
        updatedItems[index] = {
            ...updatedItems[index],
            detailQuantity: newQuantity,
            quantity: newQuantity.reduce((acc, detail) => acc + detail.quantity, 0),
            totalPrice: newQuantity.reduce((acc, detail) => acc + detail.quantity * detail.price, 0),
            comission: newQuantity.reduce((acc, detail) => acc + (detail.quantity * (item.sellingPrice ?? item.costPrice) - detail.quantity * detail.price), 0),
        }
        setDraft({ ...draft, items: updatedItems })
    }, [newQuantity])

    return (
        <>
        <div
            className='flex items-center gap-2 text-slate-300'
        >
            <span className='flex-1 truncate'>
                {`${item.name}`}
            </span>
            <div>{newQuantity.map((detail, detailIndex) =>
                    <div className="flex items-center gap-2" key={detailIndex}>
                        <button className="text-red-400 hover:text-red-600"
                        onClick={() => setNewQuantity(newQuantity.filter((_, i) => i !== detailIndex))}
                        ><Trash size={15} /></button>
                        <input
                            type='number'
                            min={0}
                            value={detail.quantity}
                            onChange={(e)=> {
                                const updatedQuantity: quantityDetail[] = [...newQuantity]
                                updatedQuantity[detailIndex] = {
                                    ...updatedQuantity[detailIndex],
                                    quantity: parseInt(e.target.value) || 0,
                                }
                                setNewQuantity(updatedQuantity)
                            }}

                            className='w-16 bg-slate-900 border border-slate-700 rounded-lg p-1'
                        />
                        <span>x</span>
                        <input
                            type='number'
                            min={0}
                            value={detail.price}
                            onChange={(e)=> {
                                const updatedQuantity = [...newQuantity]
                                updatedQuantity[detailIndex] = {
                                    ...updatedQuantity[detailIndex],
                                    price: parseFloat(e.target.value) || 0,
                                }
                                setNewQuantity(updatedQuantity)
                            }}

                            className='w-20 bg-slate-900 border border-slate-700 rounded-lg p-1'
                        />
                        <span>{(draft.items[detailIndex]?.totalPrice ?? detail.quantity * detail.price).toFixed(2)}</span>
                        <span>{(draft.items[detailIndex]?.comission ?? detail.quantity * (item.sellingPrice - detail.price)).toFixed(2)}</span>
                    </div>
                )}

            </div>

        </div>
        <div className="flex items-center justify-end gap-2">
            <button onClick={()=>setNewQuantity([...newQuantity,{price:item.sellingPrice,quantity:1}])}
                    className="px-3 py-1 my-2 rounded-lg bg-blue-600 font-semibold"
                >+Add Row</button>
        </div>
        </>
    )
}
