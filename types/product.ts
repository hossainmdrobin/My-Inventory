export interface Product {
  _id?: string;
  name: string;
  sku?: string;
  category?: string;
  stock: number;
  costPrice?: number;
  sellingPrice?: number;
  supplier?: string | { name?: string };
  unit: string;
  createdAt?: string;
  updatedAt?: string;
}
