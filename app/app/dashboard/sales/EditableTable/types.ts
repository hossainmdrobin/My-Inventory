export type EditableItem = {
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

export type EditableSale = {
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
