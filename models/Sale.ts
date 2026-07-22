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
    totalPrice: { type: Number, default: 0 },
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
      type: String, enum: ["RETURN", "OPENING", "DAMAGE"], default: "OPENING"
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
    date: { type: Date, default: new Date() },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);


/* ---------------- Stock adjustment helper ----------------
 * Reduces/ restores product stock based on the DIFFERENCE between the new
 * and original item quantities. On create the original list is empty, so the
 * full quantity is applied. On update only the delta is applied, which
 * prevents stock from being reduced twice.
 */
async function applyStockDelta(items: any[], originalItems: any[] = []) {
  const sumByProduct = (arr: any[]) => {
    const map = new Map<string, number>();
    for (const it of arr) {
      const id = String(it.productId);
      map.set(id, (map.get(id) || 0) + (Number(it.quantity) || 0));
    }
    return map;
  };

  const original = sumByProduct(originalItems);
  const next = sumByProduct(items);
  const ids = new Set<string>([...original.keys(), ...next.keys()]);

  for (const id of ids) {
    const delta = (next.get(id) || 0) - (original.get(id) || 0);
    // positive delta => more sold => reduce stock; negative => restore stock
    if (delta !== 0) {
      await Product.findByIdAndUpdate(id, { $inc: { stock: -delta } });
    }
  }
}

/* ---------------- Hooks ---------------- */

// Capture original items only when modifying an existing sale so we can
// compute the quantity delta later.
SaleSchema.pre("save", async function () {
  if (this.isNew) {
    (this as any).$locals.isNewSale = true;
  } else {
    const original: any = await Sale.findById(this._id).lean();
    (this as any).$locals.originalItems = original?.items || [];
  }
});

SaleSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate() as any;
  const hasItems = !!(update?.items || update?.$set?.items);
  if (!hasItems) return; // only recompute stock when items change

  const original: any = await Sale.findOne(this.getQuery()).lean();
  (this as any).$locals.originalItems = original?.items || [];
});

SaleSchema.post("save", async function (doc) {
  try {
    const sale = doc;
    const locals = (this as any).$locals || {};
    const isNew = locals.isNewSale ?? this.isNew;

    // 🔻 Opening balance adds cash to institute (creation only)
    if (isNew && sale.type === "OPENING") {
      await Institute.findByIdAndUpdate(
        sale.institute,
        { $inc: { totalCashValue: sale.paid } },
        { new: true }
      );
    }

    // 🔻 Adjust product stock: full quantity on create, delta on update
    const originalItems = locals.originalItems || [];
    await applyStockDelta(sale.items, originalItems);

    // 🔻 Adjust customer account + ledger (creation only to avoid double counting)
    if (isNew && sale.customerId) {
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

// 🔻 Adjust product stock when an existing sale's quantity is updated
// (e.g. PATCH/PUT routes that use findByIdAndUpdate).
SaleSchema.post("findOneAndUpdate", async function () {
  const originalItems = (this as any).$locals?.originalItems;
  if (!originalItems) return; // items were not part of this update

  try {
    const updated: any = await Sale.findOne(this.getQuery()).lean();
    if (!updated) return;
    await applyStockDelta(updated.items, originalItems);
  } catch (error) {
    console.error("Stock update (sale update) failed:", error);
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