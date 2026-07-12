import { SaleType } from '@/types/sale'
import { Pencil, Trash2 } from 'lucide-react'
import { formatDate, formatProducts } from './utils'
import { vans } from '@/lib/lib_objects/vans'

type Props = {
    sale: SaleType
    isDeleting: boolean
    onEdit: () => void
    onDelete: () => void
}

export default function SaleRow({ sale, isDeleting, onEdit, onDelete }: Props) {
    const color = (sale.type === 'RETURN') ? 'text-yellow-400' : (sale.type === 'DAMAGE' ? 'text-red-400' : 'text-green-400');
    return (
        <tr className='hover:bg-slate-800/30 transition-colors'>
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
                {sale?.vanNo ? vans[Number(sale.vanNo)]?.name ?? '-' : '-'}
            </td>
            <td className={`px-4 ${color} py-3 text-right text-slate-200 font-medium`}>
                {sale.type || '-'}
            </td>
            <td className='px-4 py-3 text-center'>
                <div className='flex items-center justify-center gap-2'>
                    <button
                        onClick={onEdit}
                        className='inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors'
                        title='Edit sale'
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={onDelete}
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
}
