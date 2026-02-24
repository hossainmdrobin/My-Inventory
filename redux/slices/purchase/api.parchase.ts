import apiSlice from "@/redux/api/apiSlice";
import { DateRange } from "@/types/others";
import { PurchaseType } from "@/types/purchase";

type responseType = {
    data:PurchaseType[];
    limit:Number,
    totalPages:Number,

}


export const purchaseEndpoints = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPurchases: builder.query<responseType, { key?: string, range?:DateRange, limit?:number, page?:number, status?:string }>({
            query: ({ key, range, limit = 10, page = 1,status="" }) => {
                const params = new URLSearchParams();
                if (key) params.append("key", key);
                if (range?.startDate) params.append("startDate", range.startDate);
                if (range?.endDate) params.append("endDate", range.endDate);
                params.append("limit", limit.toString());
                params.append("page", page.toString());
                if(status) params.append("status", status);

                return {
                    url: `/app/dashboard/purchases/api?${params.toString()}`,
                    method: 'GET',
                };
            },
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