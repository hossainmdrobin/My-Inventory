import { SaleType } from "@/types/sale";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: SaleType = {
    items: [],
    totalPrice: 0,
    paid: 0,
    due: 0,
    description: "",
    note: "",
    vanNo:"1",
    type:"SALE"
}
const saleSlice = createSlice({
    name: 'sale',
    initialState,
    reducers: {
        selectItem: (state, action: PayloadAction<{ productId: string, name: string, costPrice: number, sellingPrice: number, stock:number }>) => {
            console.log(action.payload, "action payload")
            if (state.items.find(item => item.productId == action.payload.productId)) {
                state.items = state.items.filter(item => item.productId != action.payload.productId)
                return;
            };
            state.items.push({ productId: action.payload.productId, name: action.payload.name, quantity: 1, costPrice: action.payload.costPrice, sellingPrice: action.payload.sellingPrice, stock: action.payload.stock })
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
            state.totalPrice = calculateTotalPrice(state.items)
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
        setVanNo:(state, action: PayloadAction<string>) => {
            state.vanNo = action.payload
        },
        setPaid: (state, action: PayloadAction<number>) => {
            state.paid = action.payload
            state.due = state.totalPrice - state.paid
            state.due = state.totalPrice - state.paid
        },
        resetSale: (state) => {
            state.items = [];
            state.totalPrice = 0;
            state.paid = 0;
            state.due = 0;
            state.description = "";
            state.note = "";
        },
        setSaleType:(state, action: PayloadAction<string>) => {
            state.type = action.payload
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
    resetSale,
    setVanNo,
    setSaleType
} = saleSlice.actions;

export default saleSlice.reducer

const calculateTotalPrice = (items: { quantity: number, costPrice: number }[]) => {
    return items.reduce((total, item) => total + (item.costPrice * item.quantity), 0)
}