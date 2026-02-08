import { Product } from "@/types/product";
import apiSlice from "../api/apiSlice";


export const productEndpoints = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<Product[], { key?: string }>({
            query: ({ key }) => ({
                url: `/products?key=${key || ""}`,
                method: 'GET',
            }),
            providesTags: ["GETALLPOST"],
        }),
        createProduct: builder.mutation<any, { data: any }>({
            query: ({ data }) => ({
                url: '/products',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ["GETALLPOST"],
        }),
        updateProduct: builder.mutation<any, { id: string; data: any }>({
            query: ({ id, data }) => ({
                url: `/products/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ["GETALLPOST"],
        }),
        deleteProduct: builder.mutation<any, { id: string }>({
            query: ({ id }) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["GETALLPOST"],
        }),
    }),
});

export const { useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation } = productEndpoints;