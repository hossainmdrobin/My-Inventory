import { model, models, Schema } from "mongoose";

export interface TransactionType {
    amount: number,
    destinationBank?: Schema.Types.ObjectId,
    destinationSupplier?: Schema.Types.ObjectId,
    note?: string,
}

const TransactionSchema = new Schema<TransactionType>({
    amount: { type: Number, required: true },
    destinationBank: { type: Schema.Types.ObjectId, ref: "Bank" },
    destinationSupplier: { type: Schema.Types.ObjectId, ref: "Supplier" },
    note: { type: String },
}, { timestamps: true });

const Transaction = models.Transaction || model<TransactionType>("Transaction", TransactionSchema);

export default Transaction;
