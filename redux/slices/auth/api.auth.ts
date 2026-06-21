import { apiSlice } from "@/redux/api/apiSlice";
import { UserWithInstitute, UserResponse } from "@/types/user";

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  password?: string;
  institute?: string;
}

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
    getUser: builder.query<UserWithInstitute, string>({
      query: (id) => `/api/auth/user/${id}`,
      providesTags: ["Users"],
    }),
    updateUser: builder.mutation<UserWithInstitute, { id: string; data: UpdateUserData }>({
      query: ({ id, data }) => ({
        url: `/api/auth/user/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetMeQuery, useGetUsersQuery, useGetUserQuery, useUpdateUserMutation } = authApi;