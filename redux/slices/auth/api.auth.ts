import { apiSlice } from "@/redux/api/apiSlice";
import { UserWithInstitute, UserResponse } from "@/types/user";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<UserWithInstitute | null, void>({
      query: () => "/api/auth/me",
      providesTags: ["GETALLPOST"],
    }),
    getUsers: builder.query<UserResponse, {
      page?: number;
      limit?: number;
      search?: string;
      role?: string;
    }>({
      query: ({ page = 1, limit = 10, search = "", role }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (search) params.append("search", search);
        if (role) params.append("role", role);
        return `/api/auth/user?${params.toString()}`;
      },
      providesTags: ["Users"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetMeQuery, useGetUsersQuery } = authApi;