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