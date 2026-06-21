import { Supplier } from "@/types/supplier";
import { BankAccount } from "@/types/bank";
import apiSlice from "../api/apiSlice";

export interface CreateTransactionPayload {
    amount: number;
    source: string;
    sourceWallet?: string;
    sourceSupplier?: string;
    destinationWallet?: string;
    destinationSupplier?: string;
    note?: string;
}


export const productEndpoints = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSuppliers: builder.query<Supplier[], { key?: string }>({
            query: ({ key }) => ({
                url: `/app/dashboard/suppliers/api?key=${key || ""}`,
                method: 'GET',
            }),
            providesTags: ["GETALLPOST"],
        }),
        createSupplier: builder.mutation<any, { data: Supplier }>({
            query: ({ data }) => ({
                url: `/app/dashboard/suppliers/api`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ["GETALLPOST"],
        }),
        updateSupplier: builder.mutation<any, { id: string; data: any }>({
            query: ({ id, data }) => ({
                url: `/app/dashboard/suppliers/api/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ["GETALLPOST"],
        }),
        deleteSupplier: builder.mutation<any, { id: string }>({
            query: ({ id }) => ({
                url: `/app/dashboard/suppliers/api/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["GETALLPOST"],
        }),

        getBanks: builder.query<BankAccount[], void>({
            query: () => ({
                url: `/app/dashboard/banks/api`,
                method: 'GET',
            }),
            providesTags: ["BANKS"],
        }),
        createBank: builder.mutation<any, { data: Partial<BankAccount> }>({
            query: ({ data }) => ({
                url: `/app/dashboard/banks/api`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ["BANKS"],
        }),
        updateBank: builder.mutation<any, { id: string; data: Partial<BankAccount> }>({
            query: ({ id, data }) => ({
                url: `/app/dashboard/banks/api/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ["BANKS"],
        }),
        deleteBank: builder.mutation<any, { id: string }>({
            query: ({ id }) => ({
                url: `/app/dashboard/banks/api/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["BANKS"],
        }),
        createTransaction: builder.mutation<any, CreateTransactionPayload>({
            query: (data) => ({
                url: `/app/dashboard/accounts/api/transaction`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ["BANKS", "TRANSACTIONS", "GETALLPOST"],
        }),
    }),
});

export const { 
    useGetSuppliersQuery,
    useCreateSupplierMutation,
    useUpdateSupplierMutation,
    useDeleteSupplierMutation,
    useGetBanksQuery,
    useCreateBankMutation,
    useUpdateBankMutation,
    useDeleteBankMutation,
    useCreateTransactionMutation
} = productEndpoints;