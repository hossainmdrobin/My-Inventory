import { Schema, model, models, Document } from "mongoose";
// Account Types by Category
//     Asset: ["Cash", "Bank", "Inventory", "Accounts Receivable", "Wallet"],
//     Liability: ["Accounts Payable", "Loans"],
//     Equity: ["Owner Capital"],
//     Income: ["Sales", "Service Income"],
//     Expense: ["Salary", "Rent", "Utilities"],

export interface IWallet extends Document {
    institute: Schema.Types.ObjectId;
    name: string;
    accountNumber: string;
    type: string;
    category: string;
    balance: number;
    loan: number;
    notes?: string;
}

const WalletSchema = new Schema<IWallet>(
    {
        institute: {
            type: Schema.Types.ObjectId,
            ref: "Institute",
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        accountNumber: {
            type: String,
            trim: true,
        },
        type: {
            type: String,
            // default: "Checking",
        },
        category: {
            type: String,
            default: "Asset",
        },
        balance: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        loan: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

const Wallet = models.Wallet || model<IWallet>("Wallet", WalletSchema );

export default Wallet;