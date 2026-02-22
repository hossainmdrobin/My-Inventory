import { Schema, model, models, Types } from "mongoose";

/* ---------------- Purchase Item Schema ---------------- */
const SaleItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
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
    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      min: 0,
    },
  },
  { _id: false } // prevent auto _id for subdocuments
);

/* ---------------- Purchase Schema ---------------- */
const SaleSchema = new Schema(
  {
    productName: {
      type: String,
      trim: true,
    },

    items: {
      type: [SaleItemSchema],
      required: true,
      validate: [(val: any[]) => val.length > 0, "At least one item required"],
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    paid: {
      type: Number,
      required: true,
      min: 0,
    },

    due: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      trim: true,
    },

    note: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

/* ---------------- Model Export ---------------- */
const Sale =
  models.Sale || model("Sale", SaleSchema);

export default Sale;