import React, { useState } from 'react'
import { SaleType } from '@/types/sale'
import { useUpdateSaleMutation } from '@/redux/slices/sales/api.sale'
import { vans } from '@/lib/lib_objects/vans'

type EditableItem = {
    productId: string
    name: string
    stock: number
    supplier?: string
    quantity: number
    costPrice: number
    sellingPrice: number
    totalPrice: number
    comission: number
    detailQuantity: { quantity: number; price: number }[]
}

type EditableSale = {
    _id: string
    vanNo: string
    type: string
    note: string
    description: string
    paid: number
    due: number
    totalPrice: number
    items: EditableItem[]
    createdAt?: Date
}

function toEditable(sale: SaleType): EditableSale {
    return {
        _id: sale._id || '',
        vanNo: sale.vanNo?.toString() || '1',
        type: sale.type?.toString() || 'OPENING',
        note: sale.note || '',
        description: sale.description || '',
        paid: sale.paid || 0,
        due: sale.due || 0,
        totalPrice: sale.totalPrice || 0,
        items: (sale.items || []).map((item) => ({
            productId:
                typeof item.productId === 'object'
                    ? (item.productId as { _id?: string })._id || ''
                    : item.productId,
            name: item.name,
            stock: item.stock || 0,
            supplier: item.supplier,
            quantity: item.quantity,
            costPrice: item.costPrice,
            sellingPrice: item.sellingPrice || 0,
            totalPrice: item.totalPrice || 0,
            comission: item.comission || 0,
            detailQuantity: item.detailQuantity || [],
        })),
        createdAt: sale.createdAt,
    }
}

function recompute(sale: EditableSale) {
    const totalPrice = sale.items.reduce(
        (sum, item) => sum + item.sellingPrice * item.quantity,
        0
    )
    const due = Math.max(totalPrice - sale.paid, 0)
    return { ...sale, totalPrice, due }
}

export default function EditableTable({ sales }: { sales: SaleType[] }) {
    const [edits, setEdits] = useState<Record<string, EditableSale>>({})
    const [updateSale, { isLoading }] = useUpdateSaleMutation()

    const getDraft = (sale: SaleType): EditableSale =>
        edits[sale._id || ''] ?? toEditable(sale)

    const updateDraft = (
        id: string,
        base: SaleType,
        updater: (s: EditableSale) => EditableSale
    ) => {
        setEdits((prev) => ({
            ...prev,
            [id]: updater(edits[id] ?? toEditable(base)),
        }))
    }

    const updateItem = (
        id: string,
        base: SaleType,
        index: number,
        patch: Partial<EditableItem>
    ) => {
        updateDraft(id, base, (sale) => {
            const items = sale.items.map((it, i) =>
                i === index ? { ...it, ...patch } : it
            )
            return recompute({ ...sale, items })
        })
    }

    const save = async (sale: SaleType) => {
        const draft = getDraft(sale)
        await updateSale({
            id: draft._id,
            data: {
                vanNo: draft.vanNo,
                type: draft.type,
                note: draft.note,
                description: draft.description,
                paid: draft.paid,
                due: draft.due,
                totalPrice: draft.totalPrice,
                items: draft.items,
            },
        })
    }

    if (!sales || sales.length === 0) {
        return (
            <div className='rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center'>
                <div className='text-slate-500 text-sm'>No sales found</div>
            </div>
        )
    }

    return (
        <div className='space-y-6'>
            {sales.map((sale) => {
                const draft = getDraft(sale)
                return (
                    <div
                        key={draft._id}
                        className='bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4'
                    >
                        <div className='flex flex-wrap items-end gap-4'>
                            <div className='flex flex-col'>
                                <label className='text-xs text-slate-400 mb-1'>Van</label>
                                <select
                                    value={draft.vanNo}
                                    onChange={(e) =>
                                        updateDraft(draft._id, sale, (s) => ({
                                            ...s,
                                            vanNo: e.target.value,
                                        }))
                                    }
                                    className='w-32 text-gray-400 bg-slate-800 border border-slate-700 rounded-lg p-2'
                                >
                                    {vans.map((van) => (
                                        <option key={van.vanNo} value={van.vanNo}>
                                            {van.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex flex-col'>
                                <label className='text-xs text-slate-400 mb-1'>Type</label>
                                <select
                                    value={draft.type}
                                    onChange={(e) =>
                                        updateDraft(draft._id, sale, (s) => ({
                                            ...s,
                                            type: e.target.value,
                                        }))
                                    }
                                    className='w-32 text-gray-400 bg-slate-800 border border-slate-700 rounded-lg p-2'
                                >
                                    <option value='OPENING'>Opening</option>
                                    <option value='RETURN'>Return</option>
                                    <option value='DAMAGE'>Damage</option>
                                </select>
                            </div>
                            <div className='flex flex-col'>
                                <label className='text-xs text-slate-400 mb-1'>Paid</label>
                                <input
                                    type='number'
                                    min={0}
                                    value={draft.paid}
                                    onChange={(e) =>
                                        updateDraft(draft._id, sale, (s) =>
                                            recompute({ ...s, paid: Number(e.target.value) })
                                        )
                                    }
                                    className='w-28 bg-slate-800 border border-slate-700 rounded-lg p-2'
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label className='text-xs text-slate-400 mb-1'>Due</label>
                                <input
                                    type='number'
                                    min={0}
                                    value={draft.due}
                                    onChange={(e) =>
                                        updateDraft(draft._id, sale, (s) => ({
                                            ...s,
                                            due: Number(e.target.value),
                                        }))
                                    }
                                    className='w-28 bg-slate-800 border border-slate-700 rounded-lg p-2'
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label className='text-xs text-slate-400 mb-1'>Total</label>
                                <div className='w-28 bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-300'>
                                    ₹{draft.totalPrice.toFixed(2)}
                                </div>
                            </div>
                            <button
                                onClick={() => save(sale)}
                                disabled={isLoading}
                                className='px-4 py-2 rounded-lg bg-blue-600 font-semibold disabled:opacity-50'
                            >
                                {isLoading ? 'Saving...' : 'Save'}
                            </button>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <input
                                value={draft.note}
                                placeholder='Note'
                                onChange={(e) =>
                                    updateDraft(draft._id, sale, (s) => ({
                                        ...s,
                                        note: e.target.value,
                                    }))
                                }
                                className='w-full bg-slate-800 border border-slate-700 rounded-lg p-2'
                            />
                            <input
                                value={draft.description}
                                placeholder='Description'
                                onChange={(e) =>
                                    updateDraft(draft._id, sale, (s) => ({
                                        ...s,
                                        description: e.target.value,
                                    }))
                                }
                                className='w-full bg-slate-800 border border-slate-700 rounded-lg p-2'
                            />
                        </div>

                        <div className='overflow-x-auto bg-slate-800/40 border border-slate-700 rounded-lg p-2'>
                            <table className='w-full text-left text-sm'>
                                <thead className='text-slate-400'>
                                    <tr>
                                        <th className='px-2 py-1'>Product</th>
                                        <th className='px-2 py-1'>Supplier</th>
                                        <th className='px-2 py-1'>Quantity</th>
                                        <th className='px-2 py-1'>Selling Price</th>
                                        <th className='px-2 py-1'>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {draft.items.map((item, index) => (
                                        <tr key={item.productId} className='border-t border-slate-700'>
                                            <td className='px-2 py-1 text-slate-300'>{item.name}</td>
                                            <td className='px-2 py-1 text-slate-400'>{item.supplier || '-'}</td>
                                            <td className='px-2 py-1'>
                                                <input
                                                    type='number'
                                                    min={0}
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        updateItem(draft._id, sale, index, {
                                                            quantity: Number(e.target.value),
                                                        })
                                                    }
                                                    className='w-20 bg-slate-800 border border-slate-700 rounded-lg p-1'
                                                />
                                            </td>
                                            <td className='px-2 py-1'>
                                                <input
                                                    type='number'
                                                    min={0}
                                                    value={item.sellingPrice}
                                                    onChange={(e) =>
                                                        updateItem(draft._id, sale, index, {
                                                            sellingPrice: Number(e.target.value),
                                                        })
                                                    }
                                                    className='w-24 bg-slate-800 border border-slate-700 rounded-lg p-1'
                                                />
                                            </td>
                                            <td className='px-2 py-1 text-slate-300'>
                                                ₹{(item.sellingPrice * item.quantity).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
