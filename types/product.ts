export interface Product {
  _id?: string;
  name: string;
  sku?: string;
  category?: string;
  stock: number;
  costPrice?: number;
  sellingPrice?: number;
  supplier?: string; // This can be the supplier's name or ID depending on how you implement it
  unit: string;
  createdAt?: string;
  updatedAt?: string;
}
