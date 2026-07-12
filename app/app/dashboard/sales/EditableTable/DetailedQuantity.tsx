import { SaleItemType } from "@/types/sale"

export default function DetailedQuantity({
    item,
    index,
}: {
    item: SaleItemType
    index: number
}) {
    console.log('item', item)
    return (
        <div
            className='flex items-center gap-2 text-slate-300'
        >
            <span className='flex-1 truncate'>
                {item.name}
            </span>
            <div>
                <div>
                    <input
                        type='number'
                        min={0}
                        value={item.quantity}

                        className='w-16 bg-slate-900 border border-slate-700 rounded-lg p-1'
                    />
                    <span>x</span>
                    <input
                        type='number'
                        min={0}
                        value={item.sellingPrice}

                        className='w-20 bg-slate-900 border border-slate-700 rounded-lg p-1'
                    />
                </div>
            </div>

        </div>
    )
}
