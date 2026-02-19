import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: false, unique: true },
    category: { type: String, required: false },
    stock: { type: Number, default: 0 },
    costPrice: { type: Number, required: false },
    sellingPrice: { type: Number },
    supplier: {type:Schema.Types.ObjectId, ref: "Supplier", required: false},
    unit: { type: String, default: "unit" },
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);

export default Product;
