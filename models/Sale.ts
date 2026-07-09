import { Schema, model, models, Types } from "mongoose";
import Product from "./Product";
import Customer from "./Customer";
import CustomerLedger from "./CustomerLedger";
import Institute from "./Institute";

/* ---------------- Purchase Item Schema ---------------- */
const SaleItemSchema = new Schema(
  {
    institute: { type: Types.ObjectId, ref: "Institute" },
    supplier: {
      type: String, // can be ObjectId or String
      ref: "Supplier",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      default: new Date()
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    detailQuantity: [{
      quantity: Number, price: Number
    }],
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
    totalPrice:{ type: Number, default: 0 },
    comission: { type: Number, default: 0 },
  },
  { _id: false } // prevent auto _id for subdocuments
);

/* ---------------- Purchase Schema ---------------- */
const SaleSchema = new Schema(
  {
    institute: {
      type: Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    productName: {
      type: String,
      trim: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    type: {
      type: String, enum: ["RETURN", "OPENING", "DAMAGE"], default: "SALE"
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
    vanNo: { type: String, required: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);


SaleSchema.post("save", async function (doc) {
  try {
    const sale = doc;
    if (sale.type === "OPENING") {
      const updated = await Institute.findByIdAndUpdate(sale.institute, { $inc: { totalCashValue: sale.paid } }, { new: true });
    }
    // 🔻 Update product stock (your existing logic)
    for (const item of sale.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // 🔻 Adjust customer account
    if (sale.customerId) {
      await Customer.findByIdAndUpdate(sale.customerId, {
        $inc: {
          totalDue: sale.due,
          totalPaid: sale.paid,
        },
      });

      // 🔻 Add ledger entry
      await CustomerLedger.create({
        customerId: sale.customerId,
        type: "SALE",
        amount: sale.due,
        note: "Sale created",
        createdBy: sale.createdBy,
      });
    }
  } catch (error) {
    console.error("Post-sale update failed:", error);
  }
});

// SaleSchema.post("save", async function (doc) {
//   try {
//     const purchase = doc;

//     for (const item of purchase.items) {
//       await Product.findByIdAndUpdate(item.productId, {
//         $inc: { stock: -item.quantity },
//         ...(item.costPrice && { costPrice: item.costPrice }),
//         ...(item.sellingPrice && { sellingPrice: item.sellingPrice }),
//       });
//       console.log("inc")
//     }
//   } catch (error) {
//     console.error("Stock update failed:", error);
//   }
// });

/* ---------------- Model Export ---------------- */
const Sale =
  models.Sale || model("Sale", SaleSchema);

export default Sale;