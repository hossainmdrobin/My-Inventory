import { Schema, model, models, Types } from "mongoose";

const PurchaseItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const PurchaseSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    // supplierId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Supplier",
    //   required: true,
    // },
    items: {
      type: [PurchaseItemSchema],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Purchase =
  models.Purchase || model("Purchase", PurchaseSchema);

export default Purchase;
