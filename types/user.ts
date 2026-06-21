export interface User {
  _id: string;
  institute: string;
  email: string;
  name?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Institute {
  _id: string;
  name: string;
  description?: string;
  totalCashValue: number;
  totalCustomerDue: number;
  NetBusinessWorth: number;
}

export interface UserWithInstitute {
  _id: string;
  institute: Institute;
  email: string;
  name?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  role?: string;
  approved?: boolean;
}

export interface UserResponse {
  data: UserWithInstitute[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}