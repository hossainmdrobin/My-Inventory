import apiSlice from "@/redux/api/apiSlice";
import { AllReports } from "@/types/report";



export const reportApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardReport: builder.query<AllReports, void>({
            query: () => ({
                url: "/app/dashboard/reports/api",
                method: "GET",
            }),
            providesTags: ["Report"],
        }),
    }),
});

export const {
    useGetDashboardReportQuery,
} = reportApi;