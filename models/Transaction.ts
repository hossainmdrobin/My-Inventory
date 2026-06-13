import { model, models, Schema } from "mongoose";

export interface TransactionType {
    amount: number,
    source: string,
    sourceWallet?: Schema.Types.ObjectId,
    sourceSupplier?: Schema.Types.ObjectId,
    destinationWallet?: Schema.Types.ObjectId,
    destinationSupplier?: Schema.Types.ObjectId,
    note?: string,
}

const TransactionSchema = new Schema<TransactionType>({
    source:{ type: String, required: true },
    sourceWallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
    sourceSupplier: { type: Schema.Types.ObjectId, ref: "Supplier" },
    amount: { type: Number, required: true },
    destinationWallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
    destinationSupplier: { type: Schema.Types.ObjectId, ref: "Supplier" },
    note: { type: String },
}, { timestamps: true });

const Transaction = models.Transaction || model<TransactionType>("Transaction", TransactionSchema);

export default Transaction;
