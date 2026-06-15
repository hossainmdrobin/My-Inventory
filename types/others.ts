export type DateRange = {
  startDate: string;
  endDate: string;
};

export type FilterValues = {
  search: string;
  startDate: string;
  endDate: string;
  limit: number;
  status: "" | "due" | "paid";
};

export type AccountCategory = "Asset" | "Liability" | "Equity" | "Income" | "Expense";
export type AccountTypeName = "Cash" | "Bank" | "Inventory" | "Accounts Receivable" | "Accounts Payable" | "Loans" | "Owner Capital" | "Sales" | "Service Income" | "Salary" | "Rent" | "Utilities" | "Wallet";