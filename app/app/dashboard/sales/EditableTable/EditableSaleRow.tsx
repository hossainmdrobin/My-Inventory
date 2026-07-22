import { useEffect } from "react"
import { SaleType } from "@/types/sale"
import { formatDate } from "../utils/saleTable"
import DetailedQuantity from "./DetailedQuantity"
import {
    useUpdateSaleMutation,
} from '@/redux/slices/sales/api.sale'

type Props = {
    draft: SaleType
    setDraft: (draft: SaleType) => void
    onCancel: () => void
}

export default function EditableSaleRow({
    draft,
    setDraft,
    onCancel,
}: Props) {
    const [updateSale, {data:updatedSale, isLoading }] = useUpdateSaleMutation()
    useEffect(()=>{
        if(updatedSale){
            onCancel()
        }
    }, [updatedSale])


    return (
        <tr className='bg-slate-800/30 align-top'>
            <td className='px-4 py-3 text-slate-300'>
                {draft.createdAt ? formatDate(draft.createdAt) : ''}
            </td>
            <td className='px-4 py-3 space-y-2'>
                <input
                onChange={(e) => setDraft({ ...draft, note: e.target.value })}
                    value={draft.note}
                    placeholder='Note'

                    className='w-full bg-slate-800 border border-slate-700 rounded-lg p-2'
                />
                <input
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    value={draft.description}
                    placeholder='Description'

                    className='w-full bg-slate-800 border border-slate-700 rounded-lg p-2'
                />
            </td>
            <td className='px-4 py-3'>
                <div className='space-y-2'>
                    <div className='bg-slate-800 border border-slate-700 rounded-lg p-2 space-y-1'>
                        {draft.items.map((item, index) => (
                            <DetailedQuantity
                                key={index}
                                item={item}
                                index={index}
                                draft={draft}
                                setDraft={setDraft}
                            />
                        ))}
                    </div>
                </div>
            </td>
            <td className='px-4 py-3 text-right text-slate-200 font-medium'>
                ৳ {draft.totalPrice.toFixed(2)}
            </td>
            <td className='px-4 py-3'>
                <div className='flex flex-col items-center gap-2'>
                    <button
                        onClick={()=>updateSale({ id: draft._id || '', data: draft })}
                        disabled={isLoading}
                        className='px-3 py-1 rounded-lg bg-blue-600 font-semibold text-xs disabled:opacity-50'
                    >
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        onClick={onCancel}
                        className='px-3 py-1 rounded-lg border border-slate-600 text-xs'
                    >
                        Cancel
                    </button>
                </div>
            </td>
        </tr>
    )
}
