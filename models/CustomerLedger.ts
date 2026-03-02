import { Schema, model, models, Types } from "mongoose";

export interface LedgerType {
  customerId: Types.ObjectId;
  type: "SALE" | "PAYMENT" | "ADJUSTMENT";
  amount: number;
  note?: string;
  createdBy?: Types.ObjectId;
}

const CustomerLedgerSchema = new Schema<LedgerType>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    type: { type: String, enum: ["SALE", "PAYMENT", "ADJUSTMENT"], required: true },
    amount: { type: Number, required: true },
    note: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const CustomerLedger =
  models.CustomerLedger || model<LedgerType>("CustomerLedger", CustomerLedgerSchema);

export default CustomerLedger;