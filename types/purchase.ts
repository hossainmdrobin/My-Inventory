// types/purchase.ts

import { Types } from "mongoose";

// Type for a single purchase item
export type PurchaseItemType = {
  productId: Types.ObjectId;
  quantity: number;
};

// Type for the purchase document
export type PurchaseType = {
  _id?: Types.ObjectId;       // optional because MongoDB will generate it
  productName: string;
//   supplierId?: Types.ObjectId;
  items: PurchaseItemType[];
  totalPrice: number;
  createdBy: Types.ObjectId;
  createdAt?: Date;           // from timestamps
  updatedAt?: Date;           // from timestamps
};