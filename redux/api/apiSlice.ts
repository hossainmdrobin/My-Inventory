// services/apiSlice.ts
import { GET } from '@/app/api/auth/me/route';
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
        "BANKS"
    ], 
});


export default apiSlice;