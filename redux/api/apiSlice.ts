// services/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: "",
    }), endpoints: () => ({}),                   // leave empty
    tagTypes: [
        "GETALLPOST",
        "GETALLPURCHASES",
        "GETALLSALES",
        "GETALLPRODUCTS",
        "GETALLSUPPLIERS",
        "CUSTOMER_ACCOUNT",
        "CUSTOMERS",
        "Employee",
        "BANKS",
        "SETTINGS",
        "JOURNAL_ENTRIES",
        "TRANSACTIONS",
        "Users"
    ],
});


export default apiSlice;