import { Schema, model, models, Document } from "mongoose";

export interface IInstitute extends Document {
  name: string;
  description?: string;
  salesAccount: Schema.Types.ObjectId;
  salesCostAccount: Schema.Types.ObjectId;
  returnAccount: Schema.Types.ObjectId;
  totalCashValue: number;
  totalCustomerDue: number;
  NetBusinessWorth: number;
}

const InstituteSchema = new Schema<IInstitute>(
  {
    name: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    salesAccount: {
      type: Schema.Types.ObjectId,
      ref:"Wallet"
    },
    returnAccount:{
      type:Schema.Types.ObjectId,
      ref:"Wallet"
    },
    salesCostAccount: {
      type: Schema.Types.ObjectId,
      ref:"Wallet"
    },
    totalCashValue: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    totalCustomerDue: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    NetBusinessWorth: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const Institute =
  models.Institute || model("Institute", InstituteSchema);

export default Institute;
