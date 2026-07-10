import { Product } from "@/types/product";
import apiSlice from "../api/apiSlice";

export interface ProductState {
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}


export const productEndpoints = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<ProductState, { key?: string, limit?: number, page?: number }>({
            query: ({ key, limit, page }) => ({
                url: `/app/dashboard/products/api?key=${key || ""}&limit=${limit || 50}&page=${page || 1}`,
                method: 'GET',
            }),
            providesTags: ["GETALLPRODUCTS"],
        }),
        createProduct: builder.mutation<any, { data: any }>({
            query: ({ data }) => ({
                url: `/app/dashboard/products/api`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ["GETALLPRODUCTS"],
        }),
        updateProduct: builder.mutation<any, { id: string; data: any }>({
            query: ({ id, data }) => ({
                url: `/app/dashboard/products/api/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ["GETALLPRODUCTS"],
        }),
        deleteProduct: builder.mutation<any, { id: string }>({
            query: ({ id }) => ({
                url: `/app/dashboard/products/api/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["GETALLPRODUCTS"],
        }),
    }),
});

export const { useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} = productEndpoints;