import { Schema, model, models } from "mongoose";

const SupplierSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            default: "",
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Supplier =
    models.Supplier || model("Supplier", SupplierSchema);

export default Supplier;
