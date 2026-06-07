
// Type for a single purchase item
export type SaleItemType = {
  name:string;
  stock:number;
  productId: string;
  quantity: number;
  costPrice: number;
  sellingPrice?: number; // optional, in case you want to track selling price as well
};

// Type for the purchase document
export type SaleType = {
  _id?: string;       // optional because MongoDB will generate it
  productName?: string;
  //   supplierId?: Types.ObjectId;
  items: SaleItemType[];
  totalPrice: number;
  paid: number;
  due: number;
  description?: string; // optional, for any additional info about the item
  note?: string
  createdBy?: string;
  createdAt?: Date;           // from timestamps
  updatedAt?: Date;     
  vanNo:String      // from timestamps
};

export type PopulatedSaleType = Omit<SaleType, "items" | "createdBy"> & {
  items: (SaleItemType & { productId: { name: string; sku: string } })[];
  createdBy?: { email: string };
};