import { apiSlice } from "@/redux/api/apiSlice";
import { Employee, EmployeeResponse } from "@/types/employee";



export const employeeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ GET ALL EMPLOYEES (pagination + search + filter)
    getEmployees: builder.query<
      EmployeeResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        status?: string;
      }
    >({
      query: ({ page = 1, limit = 10, search = "", role, status }) => {
        const params = new URLSearchParams();

        params.append("page", page.toString());
        params.append("limit", limit.toString());

        if (search) params.append("search", search);
        if (role) params.append("role", role);
        if (status) params.append("status", status);

        return `/app/dashboard/employees/api?${params.toString()}`;
      },
      providesTags: ["Employee"],
    }),

    // ✅ GET SINGLE EMPLOYEE
    getEmployee: builder.query<Employee, string>({
      query: (id) => `/app/dashboard/employees/api/${id}`,
      providesTags: ["Employee"],
    }),

    // ✅ CREATE EMPLOYEE
    createEmployee: builder.mutation<Employee, Partial<Employee>>({
      query: (data) => ({
        url: "/app/dashboard/employees/api",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Employee"],
    }),

    // ✅ UPDATE EMPLOYEE
    updateEmployee: builder.mutation<
      Employee,
      { id: string; data: Partial<Employee> }
    >({
      query: ({ id, data }) => ({
        url: `/app/dashboard/employees/api/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Employee"],
    }),

    // ✅ DELETE EMPLOYEE
    deleteEmployee: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/app/dashboard/employees/api/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employee"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;