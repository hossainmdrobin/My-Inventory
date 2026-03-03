export interface Employee {
  _id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  address?: string;
  joinDate: string;
  leaveDate?: string;
  salary?: number;
  status: "active" | "inactive" | "on_leave";
  nid?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeResponse {
  data: Employee[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}