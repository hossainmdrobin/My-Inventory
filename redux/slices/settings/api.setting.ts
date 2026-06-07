import { apiSlice } from "@/redux/api/apiSlice";
import { Institute } from "@/types/user";

export const settingEndpoints = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getInstitutes: builder.query<Institute[], void>({
            query: () => ({
                url: "/app/dashboard/settings/api",
                method: "GET",
            }),
            providesTags: ["SETTINGS"],
        }),
        createInstitute: builder.mutation<Institute, Partial<Institute>>({
            query: (data) => ({
                url: "/app/dashboard/settings/api",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["SETTINGS"],
        }),
        getInstitute: builder.query<Institute, string>({
            query: (id) => `/app/dashboard/settings/api/${id}`,
            providesTags: ["SETTINGS"],
        }),
        updateInstitute: builder.mutation<Institute, { id: string; data: Partial<Institute> }>({
            query: ({ id, data }) => ({
                url: `/app/dashboard/settings/api/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["SETTINGS"],
        }),
        deleteInstitute: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/app/dashboard/settings/api/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["SETTINGS"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetInstitutesQuery,
    useCreateInstituteMutation,
    useGetInstituteQuery,
    useUpdateInstituteMutation,
    useDeleteInstituteMutation,
} = settingEndpoints;
