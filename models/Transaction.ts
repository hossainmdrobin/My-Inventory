import { model, models, Schema, Types } from "mongoose";

export interface TransactionType {
    user:Types.ObjectId
    amount: number,
    source: string,
    sourceWallet?: Schema.Types.ObjectId,
    sourceSupplier?: Schema.Types.ObjectId,
    destinationWallet?: Schema.Types.ObjectId,
    destinationSupplier?: Schema.Types.ObjectId,
    note?: string,
    newAmmount?: number,
}

const TransactionSchema = new Schema<TransactionType>({
    user:{type:Types.ObjectId},
    source: { type: String, required: true },
    sourceWallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
    sourceSupplier: { type: Schema.Types.ObjectId, ref: "Supplier" },
    amount: { type: Number, required: true },
    destinationWallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
    destinationSupplier: { type: Schema.Types.ObjectId, ref: "Supplier" },
    note: { type: String },
    newAmmount: { type: Number },
}, { timestamps: true });

const Transaction = models.Transaction || model<TransactionType>("Transaction", TransactionSchema);

export default Transaction;
