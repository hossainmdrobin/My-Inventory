import { SaleItemType,SaleType } from "@/types/sale"

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
    console.log('item', item)
    return (
        <div
            className='flex items-center gap-2 text-slate-300'
        >
            <span className='flex-1 truncate'>
                {item.name}
            </span>
            <div>{item.detailQuantity.map((detail, detailIndex) =>
                    <div>
                        <input
                            type='number'
                            min={0}
                            value={detail.quantity}

                            className='w-16 bg-slate-900 border border-slate-700 rounded-lg p-1'
                        />
                        <span>x</span>
                        <input
                            type='number'
                            min={0}
                            value={detail.price}

                            className='w-20 bg-slate-900 border border-slate-700 rounded-lg p-1'
                        />
                    </div>
                )}

            </div>

        </div>
    )
}
