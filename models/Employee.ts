import { Schema, model, models, Types } from "mongoose";

/* ---------------- Employee Schema ---------------- */

export type EmployeeRole =
    | "driver"
    | "admin"
    | "manager"
    | "worker"
    | "seller";

export interface EmployeeType {
    token: string
    name: string;
    role: EmployeeRole;
    phone: string;
    email?: string;
    address?: string;
    joinDate?: Date;
    leaveDate?: Date;
    salary?: number;
    status: "active" | "inactive" | "on_leave";
    nid?: string; // National ID (optional)
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
    institute:Types.ObjectId,
}

const EmployeeSchema = new Schema<EmployeeType>(
    {
    institute:{type:Types.ObjectId,ref:"Institute"},
        token: {
            type: String,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },

        role: {
            type: String,
            enum: ["driver", "admin", "manager", "worker", "seller"],
            required: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
        },

        address: {
            type: String,
            trim: true,
        },

        joinDate: {
            type: Date,
            required: true,
            default: Date.now,
        },

        leaveDate: {
            type: Date,
        },

        salary: {
            type: Number,
            min: 0,
        },

        status: {
            type: String,
            enum: ["active", "inactive", "on_leave"],
            default: "active",
        },

        nid: {
            type: String,
            trim: true,
        },

        notes: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

/* ---------------- Indexes ---------------- */

// Search optimization
EmployeeSchema.index({ name: "text", phone: "text", email: "text" });

/* ---------------- Model Export ---------------- */

export const Employee =
    models.Employee || model<EmployeeType>("Employee", EmployeeSchema);