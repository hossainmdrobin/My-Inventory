import { apiSlice } from "@/redux/api/apiSlice";
import { UserWithInstitute } from "@/types/user";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<UserWithInstitute | null, void>({
      query: () => "/api/auth/me",
      providesTags: ["GETALLPOST"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetMeQuery } = authApi;