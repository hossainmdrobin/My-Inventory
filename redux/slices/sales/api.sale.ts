import apiSlice from "@/redux/api/apiSlice";
import { SaleType } from "@/types/sale";


export const saleEndpoints = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSales: builder.query<SaleType[], { key?: string }>({
            query: ({ key }) => ({
                url: `/app/dashboard/sales/api?key=${key || ""}`,
                method: 'GET',
            }),
            providesTags: ["GETALLSALES"],
        }),
        createSale: builder.mutation<any, { data: SaleType }>({
            query: ({ data }) => ({
                url: `/app/dashboard/sales/api`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ["GETALLSALES"],
        }),
    }),
})

export const {
    useCreateSaleMutation,
    useGetSalesQuery
} = saleEndpoints;