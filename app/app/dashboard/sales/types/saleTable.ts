import type { SaleType } from '@/types/sale';
import type { SortColumn, SortOrder } from '@/types/others';

export type GroupedSales = {
  [vanNo: string]: {
    [date: string]: SaleType[];
  };
};

export type SortConfig = {
  sortBy: SortColumn;
  sortOrder: SortOrder;
};

export type FlatItem = {
  saleId: string;
  saleType: string;
  note: string;
  sku: string;
  supplierName: string;
  productName: string;
  price: number;
  openingQty: number;
  returnQty: number;
  damageQty: number;
  totalPrice: number;
};

export type SaleItemWithProduct = {
  productId: string | { name?: string; sku?: string; supplier?: { name?: string } };
  supplier?: string;
  name: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
};
