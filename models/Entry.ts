import mongoose, { Schema, Types, models, model } from "mongoose";

export interface IJournalEntryLine {
    account: Types.ObjectId; // reference to Chart of Account
    description?: string;
    amount: number; // positive for debit, negative for credit
    type: "debit" | "credit";
    newBalance?:number
}


const JournalEntryLineSchema = new Schema<IJournalEntryLine>(
    {
        account: {
            type: Schema.Types.ObjectId,
            ref: "Wallet",
            required: true,
        },
        description: {
            type: String,
        },
        amount: {
            type: Number,
            default: 0,
        },
        type: {
            type: String,
            enum: ["debit", "credit"],
        },
        newBalance:{
            type:Number,
            default:0
        }

    }, { timestamps: true }
);

const JournalEntryLine = models.JournalEntryLine || model("JournalEntryLine", JournalEntryLineSchema);

export default JournalEntryLine;



