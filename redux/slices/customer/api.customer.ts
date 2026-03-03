import {
    CustomerResponse,
    CreateCustomerDTO,
    UpdateCustomerDTO,
    CustomerListResponse,
} from "@/types/customer";
import apiSlice from "@/redux/api/apiSlice";

/* ================================
   Types
================================ */

export type PaymentPayload = {
    customerId: string;
    amount: number;
    note?: string;
};

export type AccountResponse = {
    customer: CustomerResponse;
    ledger: {
        _id: string;
        type: "SALE" | "PAYMENT" | "ADJUSTMENT";
        amount: number;
        note?: string;
        createdAt: string;
    }[];
};

/* ================================
   API Slice
================================ */

export const customerApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        /* ---------------- GET ALL CUSTOMERS ---------------- */
        // GET /api/customers?page=1&limit=10&search=dhaka
        getCustomers: builder.query<
            CustomerListResponse,
            { page?: number; limit?: number; search?: string }
        >({
            query: ({ page = 1, limit = 10, search = "" }) =>
                `/app/dashboard/customers/api?page=${page}&limit=${limit}&search=${search}`,
            providesTags: ["CUSTOMERS"],
        }),

        /* ---------------- GET SINGLE CUSTOMER ACCOUNT ---------------- */
        getCustomerAccount: builder.query<AccountResponse, string>({
            query: (id) => `/customers/${id}/account`,
            providesTags: (_, __, id) => [{ type: "CUSTOMER_ACCOUNT", id }],
        }),

        /* ---------------- CREATE CUSTOMER ---------------- */
        createCustomer: builder.mutation<CustomerResponse, CreateCustomerDTO>({
            query: (body) => {
                return {
                    url: "/app/dashboard/customers/api",
                    method: "POST",
                    body,
                }
            },
            invalidatesTags: ["CUSTOMERS"],
        }),

        /* ---------------- UPDATE CUSTOMER ---------------- */
        updateCustomer: builder.mutation<
            CustomerResponse,
            { id: string; data: UpdateCustomerDTO }
        >({
            query: ({ id, data }) => ({
                url: `/app/dashboard/customers/api/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["CUSTOMERS"],
        }),

        /* ---------------- DELETE CUSTOMER ---------------- */
        deleteCustomer: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/app/dashboard/customers/api${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["CUSTOMERS"],
        }),

        /* ---------------- ADMIN PAYMENT ADJUSTMENT ---------------- */
        adjustPayment: builder.mutation<{ success: boolean }, PaymentPayload>({
            query: (body) => ({
                url: "/app/dashboard/customers/api/payment",
                method: "POST",
                body,
            }),
            invalidatesTags: (_, __, arg) => [
                { type: "CUSTOMER_ACCOUNT", id: arg.customerId },
                "CUSTOMERS",
            ],
        }),
    }),
});

/* ================================
   Export Hooks
================================ */

export const {
    useGetCustomersQuery,
    useGetCustomerAccountQuery,
    useCreateCustomerMutation,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
    useAdjustPaymentMutation,
} = customerApi;