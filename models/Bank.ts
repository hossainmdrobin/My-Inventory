import { Schema, model, models, Document } from "mongoose";
import { BankAccountType } from "@/types/others";

export interface IBank extends Document {
    name: string;
    accountNumber: string;
    type: BankAccountType;
    balance: number;
    notes?: string;
}

const BankSchema = new Schema<IBank>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        accountNumber: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["Checking", "Savings", "Business", "Other"],
            default: "Checking",
        },
        balance: {
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

const Bank = models.Bank || model<IBank>("Bank", BankSchema);

export default Bank;