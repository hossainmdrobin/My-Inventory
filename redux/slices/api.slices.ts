import { Supplier } from "@/types/supplier";
import apiSlice from "../api/apiSlice";


export const productEndpoints = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSuppliers: builder.query<Supplier[], { key?: string }>({
            query: ({ key }) => ({
                url: `/app/dashboard/suppliers/api?key=${key || ""}`,
                method: 'GET',
            }),
            providesTags: ["GETALLPOST"],
        }),
        createSupplier: builder.mutation<any, { data: Supplier }>({
            query: ({ data }) => ({
                url: `/app/dashboard/suppliers/api`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ["GETALLPOST"],
        }),
        updateSupplier: builder.mutation<any, { id: string; data: any }>({
            query: ({ id, data }) => ({
                url: `/app/dashboard/suppliers/api/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ["GETALLPOST"],
        }),
        deleteSupplier: builder.mutation<any, { id: string }>({
            query: ({ id }) => ({
                url: `/app/dashboard/suppliers/api/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["GETALLPOST"],
        }),
    }),
});

export const { 
    useGetSuppliersQuery,
    useCreateSupplierMutation,
    useUpdateSupplierMutation,
    useDeleteSupplierMutation
} = productEndpoints;