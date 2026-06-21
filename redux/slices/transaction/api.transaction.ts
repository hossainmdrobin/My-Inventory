import {
    CreateTransactionDTO,
    TransactionResponse,
} from "@/types/transaction";
import apiSlice from "@/redux/api/apiSlice";

/* ================================
   API Slice
=============================== */

export const transactionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        /* ---------------- CREATE TRANSACTION ---------------- */
        // POST /app/dashboard/accounts/api/transaction
        createTransaction: builder.mutation<TransactionResponse, CreateTransactionDTO>({
            query: (body) => ({
                url: "/app/dashboard/accounts/api/transaction",
                method: "POST",
                body,
            }),
            invalidatesTags: ["TRANSACTIONS"],
        }),
    }),
});

/* ================================
   Export Hooks
=============================== */

export const { useCreateTransactionMutation } = transactionApi;
