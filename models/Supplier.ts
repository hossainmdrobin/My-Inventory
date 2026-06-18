import { Schema, model, models,Types } from "mongoose";

const SupplierSchema = new Schema(
    {
            institute:{type:Types.ObjectId,ref:"Institute"},
        
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
        due: {
            type: Number,
            default: 0
        },
        paid: {
            type: Number,
            default: 0
        },
        advance: {
            type: Number,
            default: 0
        },
        accountPayable: {
            type: Number,
            default: 0
        },
        accountReceivable: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

const Supplier = models.Supplier || model("Supplier", SupplierSchema);

export default Supplier;