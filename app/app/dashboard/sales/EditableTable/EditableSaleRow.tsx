import { vans } from '@/lib/lib_objects/vans'
import type { EditableItem, EditableSale } from './types'
import { formatDate, recompute } from './utils'

type Props = {
    draft: EditableSale
    isLoading: boolean
    updateDraft: (updater: (s: EditableSale) => EditableSale) => void
    updateItem: (index: number, patch: Partial<EditableItem>) => void
    onSave: () => void
    onCancel: () => void
}

export default function EditableSaleRow({
    draft,
    isLoading,
    updateDraft,
    updateItem,
    onSave,
    onCancel,
}: Props) {
    return (
        <tr className='bg-slate-800/30 align-top'>
            <td className='px-4 py-3 text-slate-300'>
                {formatDate(draft.createdAt)}
            </td>
            <td className='px-4 py-3 space-y-2'>
                <input
                    value={draft.note}
                    placeholder='Note'
                    onChange={(e) =>
                        updateDraft((s) => ({ ...s, note: e.target.value }))
                    }
                    className='w-full bg-slate-800 border border-slate-700 rounded-lg p-2'
                />
                <input
                    value={draft.description}
                    placeholder='Description'
                    onChange={(e) =>
                        updateDraft((s) => ({
                            ...s,
                            description: e.target.value,
                        }))
                    }
                    className='w-full bg-slate-800 border border-slate-700 rounded-lg p-2'
                />
            </td>
            <td className='px-4 py-3'>
                <div className='space-y-2'>
                    <select
                        value={draft.vanNo}
                        onChange={(e) =>
                            updateDraft((s) => ({ ...s, vanNo: e.target.value }))
                        }
                        className='w-full text-gray-400 bg-slate-800 border border-slate-700 rounded-lg p-2'
                    >
                        {vans.map((van) => (
                            <option key={van.vanNo} value={van.vanNo}>
                                {van.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={draft.type}
                        onChange={(e) =>
                            updateDraft((s) => ({ ...s, type: e.target.value }))
                        }
                        className='w-full text-gray-400 bg-slate-800 border border-slate-700 rounded-lg p-2'
                    >
                        <option value='OPENING'>Opening</option>
                        <option value='RETURN'>Return</option>
                        <option value='DAMAGE'>Damage</option>
                    </select>
                    <div className='bg-slate-800 border border-slate-700 rounded-lg p-2 space-y-1'>
                        {draft.items.map((item, index) => (
                            <div
                                key={item.productId}
                                className='flex items-center gap-2 text-slate-300'
                            >
                                <span className='flex-1 truncate'>
                                    {item.name}
                                </span>
                                <input
                                    type='number'
                                    min={0}
                                    value={item.quantity}
                                    onChange={(e) =>
                                        updateItem(index, {
                                            quantity: Number(e.target.value),
                                        })
                                    }
                                    className='w-16 bg-slate-900 border border-slate-700 rounded-lg p-1'
                                />
                                <span>x</span>
                                <input
                                    type='number'
                                    min={0}
                                    value={item.sellingPrice}
                                    onChange={(e) =>
                                        updateItem(index, {
                                            sellingPrice: Number(e.target.value),
                                        })
                                    }
                                    className='w-20 bg-slate-900 border border-slate-700 rounded-lg p-1'
                                />
                            </div>
                        ))}
                    </div>
                    <div className='flex gap-2'>
                        <input
                            type='number'
                            min={0}
                            value={draft.paid}
                            onChange={(e) =>
                                updateDraft((s) =>
                                    recompute({
                                        ...s,
                                        paid: Number(e.target.value),
                                    })
                                )
                            }
                            placeholder='Paid'
                            className='w-1/2 bg-slate-800 border border-slate-700 rounded-lg p-2'
                        />
                        <input
                            type='number'
                            min={0}
                            value={draft.due}
                            onChange={(e) =>
                                updateDraft((s) => ({
                                    ...s,
                                    due: Number(e.target.value),
                                }))
                            }
                            placeholder='Due'
                            className='w-1/2 bg-slate-800 border border-slate-700 rounded-lg p-2'
                        />
                    </div>
                </div>
            </td>
            <td className='px-4 py-3 text-right text-slate-200 font-medium'>
                ₹{draft.totalPrice.toFixed(2)}
            </td>
            <td className='px-4 py-3'>
                <div className='flex flex-col items-center gap-2'>
                    <button
                        onClick={onSave}
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
