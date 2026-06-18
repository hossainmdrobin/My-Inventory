import { Schema, model, models, Types } from "mongoose";
import Product from "./Product";
import Supplier from "./Supplier";

/* ---------------- Purchase Item Schema ---------------- */
const PurchaseItemSchema = new Schema(
  {
        institute:{type:Types.ObjectId,ref:"Institute"},
    
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
const PurchaseSchema = new Schema(
  {
    productName: {
      type: String,
      trim: true,
    },

    items: {
      type: [PurchaseItemSchema],
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
    supplier:{
      type:Schema.Types.ObjectId,
      ref:"Supplier"
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

PurchaseSchema.post("save", async function (doc) {
  try {
    const purchase = doc;
    await Supplier.findByIdAndUpdate(purchase.supplier,{
      $inc:{paid:purchase.paid,due:-purchase.due}
    })

    for (const item of purchase.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
        ...(item.costPrice && { costPrice: item.costPrice }),
        ...(item.sellingPrice && { sellingPrice: item.sellingPrice }),
      });
    }
  } catch (error) {
    console.error("Stock update failed:", error);
  }
});

/* ---------------- Model Export ---------------- */
const Purchase =
  models.Purchase || model("Purchase", PurchaseSchema);

export default Purchase;