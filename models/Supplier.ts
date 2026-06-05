import { number } from "framer-motion";
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
            required: false,
        },
        due:{
            type:Number,
            default:0
        },
        paid:{
            type:Number,
            default:0
        },
        advance:{
            type:Number,
            default:0
        }
    },
    { timestamps: true }
);

const Supplier = models.Supplier || model("Supplier", SupplierSchema);

export default Supplier;
