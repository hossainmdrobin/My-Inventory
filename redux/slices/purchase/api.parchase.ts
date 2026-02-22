import apiSlice from "@/redux/api/apiSlice";
import { PurchaseType } from "@/types/purchase";


export const purchaseEndpoints = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPurchases: builder.query<PurchaseType[], { key?: string }>({
            query: ({ key }) => ({
                url: `/app/dashboard/purchases/api?key=${key || ""}`,
                method: 'GET',
            }),
            providesTags: ["GETALLPURCHASES"],
        }),
        createPurchase: builder.mutation<any, { data: PurchaseType }>({
            query: ({ data }) => ({
                url: `/app/dashboard/purchases/api`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ["GETALLPURCHASES"],
        }),
    }),
})

export const {
    useGetPurchasesQuery,
    useCreatePurchaseMutation,
} = purchaseEndpoints;