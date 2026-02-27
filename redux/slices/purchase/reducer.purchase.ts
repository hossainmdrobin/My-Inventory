import { PurchaseType } from "@/types/purchase";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: PurchaseType = {
    items: [],
    totalPrice: 0,
    paid: 0,
    due: 0,
    description: "",
    note: "",
    supplier:""
}
const purchaseSlice = createSlice({
    name: 'purchase',
    initialState,
    reducers: {
        selectItem: (state, action: PayloadAction<{ productId: string, name: string, costPrice: number, sellingPrice: number }>) => {
            if (state.items.find(item => item.productId == action.payload.productId)) {
                state.items = state.items.filter(item => item.productId != action.payload.productId)
                return;
            };
            state.items.push({ productId: action.payload.productId, name: action.payload.name, quantity: 1, costPrice: action.payload.costPrice, sellingPrice: action.payload.sellingPrice })
            state.totalPrice = calculateTotalPrice(state.items)
            state.due = state.totalPrice - state.paid
        },
        removeItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.productId != action.payload)
            state.totalPrice = calculateTotalPrice(state.items)
            state.totalPrice = calculateTotalPrice(state.items)
            state.due = state.totalPrice - state.paid
        },

        increamentQty: (state, action: PayloadAction<string>) => {
            state.items.forEach(item => {
                if (item.productId == action.payload) {
                    item.quantity += 1
                }
            })
            state.totalPrice = calculateTotalPrice(state.items);
            state.due = state.totalPrice - state.paid
        },
        decreamentQty: (state, action: PayloadAction<string>) => {
            state.items.forEach(item => {
                if (item.productId == action.payload) {
                    if (item.quantity > 1) item.quantity -= 1
                }
            })
            state.totalPrice = calculateTotalPrice(state.items)
            state.due = state.totalPrice - state.paid
        },
        setQty: (state, action: PayloadAction<{ productId: string, quantity: number }>) => {
            state.items.forEach(item => {
                if (item.productId == action.payload.productId) {
                    if (action.payload.quantity > 0) item.quantity = action.payload.quantity
                }
            })
            state.totalPrice = calculateTotalPrice(state.items)
            state.due = state.totalPrice - state.paid
        },
        setDescription: (state, action: PayloadAction<string>) => {
            state.description = action.payload
        },
        setNote: (state, action: PayloadAction<string>) => {
            state.note = action.payload
        },
        setPaid: (state, action: PayloadAction<number>) => {
            state.paid = action.payload
            state.due = state.totalPrice - state.paid
        },
        setSupplier:(state,action:PayloadAction<string>)=>{
            state.supplier = action.payload
        },
        resetPurchase: (state) => {
            state.items = [];
            state.totalPrice = 0;
            state.paid = 0;
            state.due = 0;
            state.description = "";
            state.note = "";
        }
    },
})

export const {
    selectItem,
    removeItem,
    increamentQty,
    decreamentQty,
    setQty,
    setDescription,
    setNote,
    setPaid,
    resetPurchase,
    setSupplier
} = purchaseSlice.actions;

export default purchaseSlice.reducer

const calculateTotalPrice = (items: { quantity: number, costPrice: number }[]) => {
    return items.reduce((total, item) => total + (item.costPrice * item.quantity), 0)
}