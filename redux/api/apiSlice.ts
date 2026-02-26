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
        "GETALLSUPPLIERS"
    ], 
});


export default apiSlice;