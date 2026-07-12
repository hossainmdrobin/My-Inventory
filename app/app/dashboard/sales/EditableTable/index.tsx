import { useState } from 'react'
import { SaleType } from '@/types/sale'
import {
    useUpdateSaleMutation,
    useDeleteSaleMutation,
} from '@/redux/slices/sales/api.sale'
import { toEditable, recompute } from './utils'
import SaleRow from './SaleRow'
import EditableSaleRow from './EditableSaleRow'

export default function EditableTable({ sales }: { sales: SaleType[] }) {
    const [editingId, setEditingId] = useState<string | null>(null)
    const [draft, setDraft] = useState<SaleType | null>(null)
    const [updateSale, { isLoading }] = useUpdateSaleMutation()
    const [deleteSale, { isLoading: isDeleting }] = useDeleteSaleMutation()

    console.log("the drafg", draft)

    const startEdit = (sale: SaleType) => {
        setEditingId(sale._id || null)
        setDraft(toEditable(sale))
    }

    const cancelEdit = () => {
        setEditingId(null)
        setDraft(null)
    }

    const handleDelete = (sale: SaleType) => {
        if (confirm('Are you sure you want to delete this sale?')) {
            deleteSale({ id: sale._id || '' })
        }
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
                            <th className='px-4 py-3 text-right font-medium'>Van</th>
                            <th className='px-4 py-3 text-right font-medium'>Type</th>
                            <th className='px-4 py-3 text-center font-medium'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-800'>
                        {sales.map((sale,i) => {
                            const isEditing = editingId === sale._id && draft

                            if (isEditing) {
                                return (
                                    <EditableSaleRow
                                        key={i}
                                        draft={draft}
                                        setDraft={setDraft}
                                        isLoading={isLoading}
                                        onCancel={cancelEdit}
                                    />
                                )
                            }

                            return (
                                <SaleRow
                                    key={sale._id}
                                    sale={sale}
                                    isDeleting={isDeleting}
                                    onEdit={() => startEdit(sale)}
                                    onDelete={() => handleDelete(sale)}
                                />
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
