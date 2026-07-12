import type { SaleType } from '@/types/sale'
import type { EditableSale } from './types'

export function toEditable(sale: SaleType): EditableSale {
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

export function recompute(sale: EditableSale) {
    const totalPrice = sale.items.reduce(
        (sum, item) => sum + item.sellingPrice * item.quantity,
        0
    )
    const due = Math.max(totalPrice - sale.paid, 0)
    return { ...sale, totalPrice, due }
}

export function formatDate(date?: Date) {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

export function formatProducts(sale: SaleType) {
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
