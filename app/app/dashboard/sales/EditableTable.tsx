import React, { useState } from 'react'
import { SaleType } from '@/types/sale'
import { useUpdateSaleMutation, useDeleteSaleMutation } from '@/redux/slices/sales/api.sale'
import { vans } from '@/lib/lib_objects/vans'
import { Pencil, Trash2 } from 'lucide-react'

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

function formatDate(date?: Date) {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

function formatProducts(sale: SaleType) {
    const items = sale.items || []
    if (items.length === 0) return '-'
    return items
        .map((item) => {
            const name =
                typeof item.productId === 'object'
                    ? (item.productId as { name?: string }).name || item.name
                    : item.name
            return `${name}(${item.quantity}x)`
        })
        .join(', ')
}

export default function EditableTable({ sales }: { sales: SaleType[] }) {
    const [editingId, setEditingId] = useState<string | null>(null)
    const [draft, setDraft] = useState<EditableSale | null>(null)
    const [updateSale, { isLoading }] = useUpdateSaleMutation()
    const [deleteSale, { isLoading: isDeleting }] = useDeleteSaleMutation()

    const startEdit = (sale: SaleType) => {
        setEditingId(sale._id || null)
        setDraft(toEditable(sale))
    }

    const cancelEdit = () => {
        setEditingId(null)
        setDraft(null)
    }

    const updateDraft = (updater: (s: EditableSale) => EditableSale) => {
        setDraft((prev) => (prev ? updater(prev) : prev))
    }

    const updateItem = (index: number, patch: Partial<EditableItem>) => {
        updateDraft((sale) => {
            const items = sale.items.map((it, i) =>
                i === index ? { ...it, ...patch } : it
            )
            return recompute({ ...sale, items })
        })
    }

    const save = async () => {
        if (!draft) return
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
        cancelEdit()
    }

    if (!sales || sales.length === 0) {
        return (
            <div className='rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center'>
                <div className='text-slate-500 text-sm'>No sales found</div>
            </div>
        )
    }

    return (
        <div className='bg-slate-900 border border-slate-800 rounded-xl overflow-hidden'>
            <div className='overflow-x-auto'>
                <table className='min-w-full text-sm'>
                    <thead className='bg-slate-800/50 text-slate-400'>
                        <tr>
                            <th className='px-4 py-3 text-left font-medium'>Date</th>
                            <th className='px-4 py-3 text-left font-medium'>Note</th>
                            <th className='px-4 py-3 text-left font-medium'>Products</th>
                            <th className='px-4 py-3 text-right font-medium'>Total Price</th>
                            <th className='px-4 py-3 text-center font-medium'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-800'>
                        {sales.map((sale) => {
                            const isEditing = editingId === sale._id && draft

                            if (isEditing) {
                                return (
                                    <tr key={sale._id} className='bg-slate-800/30 align-top'>
                                        <td className='px-4 py-3 text-slate-300'>
                                            {formatDate(draft.createdAt)}
                                        </td>
                                        <td className='px-4 py-3 space-y-2'>
                                            <input
                                                value={draft.note}
                                                placeholder='Note'
                                                onChange={(e) =>
                                                    updateDraft((s) => ({
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
                                                        updateDraft((s) => ({
                                                            ...s,
                                                            vanNo: e.target.value,
                                                        }))
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
                                                        updateDraft((s) => ({
                                                            ...s,
                                                            type: e.target.value,
                                                        }))
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
                                                    onClick={save}
                                                    disabled={isLoading}
                                                    className='px-3 py-1 rounded-lg bg-blue-600 font-semibold text-xs disabled:opacity-50'
                                                >
                                                    {isLoading ? 'Saving...' : 'Save'}
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className='px-3 py-1 rounded-lg border border-slate-600 text-xs'
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }

                            return (
                                <tr
                                    key={sale._id}
                                    className='hover:bg-slate-800/30 transition-colors'
                                >
                                    <td className='px-4 py-3 text-slate-300'>
                                        {formatDate(sale.createdAt)}
                                    </td>
                                    <td className='px-4 py-3 text-slate-300'>
                                        {sale.note || '-'}
                                    </td>
                                    <td className='px-4 py-3 text-slate-400'>
                                        {formatProducts(sale)}
                                    </td>
                                    <td className='px-4 py-3 text-right text-slate-200 font-medium'>
                                        ₹{(sale.totalPrice || 0).toFixed(2)}
                                    </td>
                                    <td className='px-4 py-3 text-center'>
                                        <div className='flex items-center justify-center gap-2'>
                                            <button
                                                onClick={() => startEdit(sale)}
                                                className='inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors'
                                                title='Edit sale'
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this sale?')) {
                                                        deleteSale({ id: sale._id || '' })
                                                    }
                                                }}
                                                disabled={isDeleting}
                                                className='inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition-colors disabled:opacity-50'
                                                title='Delete sale'
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
