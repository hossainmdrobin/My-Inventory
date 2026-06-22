export interface Wallet {
  _id: string;
  institute: string;
  name: string;
  accountNumber?: string;
  type: string;
  category: string;
  balance: number;
  loan: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InstituteDefaults {
  salesAccount?: string;
  salesCostAccount?: string;
  returnAccount?: string;
}
