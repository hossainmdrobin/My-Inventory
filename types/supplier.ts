import { Types } from "mongoose";

export interface Supplier {
  _id?: string;        // MongoDB ID
  name: string;
  phone: string;
  address?: string;
  addedBy?: string;     // reference to User
  createdAt?: Date;
  updatedAt?: Date;
}
