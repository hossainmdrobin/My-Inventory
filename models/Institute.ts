import { Schema, model, models, Document } from "mongoose";

export interface IInstitute extends Document {
  name: string;
  description?: string;
  totalCashValue: number;
  totalCustomerDue: number;
  NetBusinessWorth: number;
}

const InstituteSchema = new Schema<IInstitute>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    totalCashValue: {
      type: Number,
      required: true,
      min: 0,
    },
    totalCustomerDue: {
      type: Number,
      required: true,
      min: 0,
    },
    NetBusinessWorth: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const Institute =
  models.Institute || model("Institute", InstituteSchema);

export default Institute;
