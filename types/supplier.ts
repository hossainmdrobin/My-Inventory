import { Types } from "mongoose";

export interface Supplier {
  _id?: string;
  name: string;
  phone: string;
  address?: string;
  addedBy?: string;
  due?: number;
  paid?: number;
  advance?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
