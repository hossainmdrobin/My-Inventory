export type DateRange = {
  startDate: string;
  endDate: string;
};

export type SortColumn = "productName" | "supplierName" | "quantity" | "totalPrice" | "totalReturn";
export type SortOrder = "asc" | "desc";

export type FilterValues = {
  search: string;
  startDate: string;
  endDate: string;
  limit: number;
  status: "" | "due" | "paid";
  dateMode: "range" | "single" | "month";
  sortBy: SortColumn;
  sortOrder: SortOrder;
};

export type AccountCategory = "Asset" | "Liability" | "Equity" | "Income" | "Expense";
export type AccountTypeName = "Cash" | "Bank" | "Inventory" | "Accounts Receivable" | "Accounts Payable" | "Loans" | "Owner Capital" | "Sales" | "Service Income" | "Salary" | "Rent" | "Utilities" | "Wallet" | "Incentives" | "Damage Claim" | "Extra" | "Supplier Avance";