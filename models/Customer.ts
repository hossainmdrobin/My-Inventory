import { Schema, model, models, Types } from "mongoose";

export interface CustomerType {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  totalDue: number;
  totalPaid: number;
}

const CustomerSchema = new Schema<CustomerType>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String },
    email: { type: String },
    address: { type: String },

    // Account summary
    totalDue: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Customer = models.Customer || model<CustomerType>("Customer", CustomerSchema);
export default Customer;