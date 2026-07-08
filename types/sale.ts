
// Type for a single purchase item
export type SaleItemType = {
  supplier?: string; // optional, in case you want to track the supplier for each item
  name:string;
  stock:number;
  productId: string;
  quantity: number;
  detailQuantity: { quantity: number; price: number }[]; // array of quantity and price pairs
  costPrice: number;
  sellingPrice: number; // optional, in case you want to track selling price as well
  totalPrice?:number;
  comission?:number;
};

// Type for the purchase document
export type SaleType = {
  _id?: string;       // optional because MongoDB will generate it
  institute?: string; // reference to the institute
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
  vanNo:String   ,
  type?:String   // from timestamps
};

export type PopulatedSaleType = Omit<SaleType, "items" | "createdBy"> & {
  items: (SaleItemType & { productId: { name: string; sku: string } })[];
  createdBy?: { email: string };
};