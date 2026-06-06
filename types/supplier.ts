export interface Supplier {
  _id?: string;
  name: string;
  phone: string;
  address?: string;
  addedBy?: string;
  due?: number;
  paid?: number;
  advance?: number;
  accountPayable?: number;
  accountReceivable?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
