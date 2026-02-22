// types/purchase.ts

import { Types } from "mongoose";

// Type for a single purchase item
export type PurchaseItemType = {
  name:string;
  productId: string;
  quantity: number;
  costPrice: number;
  sellingPrice?: number; // optional, in case you want to track selling price as well
};

// Type for the purchase document
export type PurchaseType = {
  _id?: Types.ObjectId;       // optional because MongoDB will generate it
  productName?: string;
  //   supplierId?: Types.ObjectId;
  items: PurchaseItemType[];
  totalPrice: number;
  paid: number;
  due: number;
  description?: string; // optional, for any additional info about the item
  note?: string
  createdBy?: string;
  createdAt?: Date;           // from timestamps
  updatedAt?: Date;           // from timestamps
};