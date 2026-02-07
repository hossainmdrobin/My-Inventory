import { Schema, model, models } from "mongoose";

const SaleItemSchema = new Schema(
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
        price: {
            type: Number, // selling price per unit
            required: true,
        },
    },
    { _id: false }
);

const SaleSchema = new Schema(
    {
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        items: {
            type: [SaleItemSchema],
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

const Sale = models.Sale || model("Sale", SaleSchema);

export default Sale;
