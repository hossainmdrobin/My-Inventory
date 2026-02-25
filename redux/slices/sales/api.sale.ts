import apiSlice from "@/redux/api/apiSlice";
import { DateRange } from "@/types/others";
import { SaleType } from "@/types/sale";

type responseType = {
    data:SaleType[];
    limit?:Number,
    totalPages:Number,
    page?:Number,
    total?:Number
}

export const saleEndpoints = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSales: builder.query<responseType, { key?: string, range?:DateRange, limit?:number, page?:number, status?:string }>({
                    query: ({ key, range, limit = 10, page = 1,status="" }) => {
                        const params = new URLSearchParams();
                        if (key) params.append("key", key);
                        if (range?.startDate) params.append("startDate", range.startDate);
                        if (range?.endDate) params.append("endDate", range.endDate);
                        params.append("limit", limit.toString());
                        params.append("page", page.toString());
                        if(status) params.append("status", status);
        
                        return {
                            url: `/app/dashboard/sales/api?${params.toString()}`,
                            method: 'GET',
                        };
                    },
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