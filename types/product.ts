export interface Product {
  _id: string;
  name: string;
  sku?: string;
  category: string;
  stock: number;
  costPrice?: number;
  sellingPrice?: number;
  createdAt: string;
  updatedAt: string;
}
