
/** Base fields */
export type CustomerType = {
  _id?: string;
  name: string;
  phone?: string | undefined;
  email?: string;
  address?: string;

  totalDue: number;
  totalPaid: number;

  createdAt?: Date;
  updatedAt?: Date;
};

/** For creating a customer */
export type CreateCustomerDTO = {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
};

/** For updating a customer */
export type UpdateCustomerDTO = Partial<CreateCustomerDTO>;

/** Lean response (safe for API return) */
export type CustomerResponse = {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  totalDue: number;
  totalPaid: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CustomerListResponse = {
  data: CustomerResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};