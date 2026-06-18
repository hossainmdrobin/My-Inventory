import apiSlice from "@/redux/api/apiSlice";

type JournalEntryLineResponse = {
    _id: string;
    account: {
        _id: string;
        name: string;
        code?: string;
    };
    description?: string;
    amount: number;
    type: "debit" | "credit";
    createdAt: string;
    updatedAt: string;
    newBalance?: number

};

type JournalEntryLineInput = {
    account: string;
    description?: string;
    amount: number;
    type: "debit" | "credit";
};

export const journalEntryEndpoints = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getJournalEntries: builder.query<JournalEntryLineResponse[], { wallet_id?: string; startDate?: string; endDate?: string; limit?: number }>({
            query: (params) => {
                const searchParams = new URLSearchParams();
                if (params?.wallet_id) searchParams.set("wallet_id", params.wallet_id);
                if (params?.startDate) searchParams.set("startDate", params.startDate);
                if (params?.endDate) searchParams.set("endDate", params.endDate);
                if (params?.limit) searchParams.set("limit", String(params.limit));
                const qs = searchParams.toString();
                return {
                    url: `/app/dashboard/accounts/api/entry${qs ? `?${qs}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["JOURNAL_ENTRIES"],
        }),
        createJournalEntry: builder.mutation<JournalEntryLineResponse, { data: JournalEntryLineInput }>({
            query: ({ data }) => ({
                url: `/app/dashboard/accounts/api/entry`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["JOURNAL_ENTRIES"],
        }),
        updateJournalEntry: builder.mutation<JournalEntryLineResponse, { id: string; data: JournalEntryLineInput }>({
            query: ({ id, data }) => ({
                url: `/app/dashboard/accounts/api/entry`,
                method: "PUT",
                body: { id, ...data },
            }),
            invalidatesTags: ["JOURNAL_ENTRIES"],
        }),
        deleteJournalEntry: builder.mutation<{ success: boolean }, { id: string }>({
            query: ({ id }) => ({
                url: `/app/dashboard/accounts/api/entry?id=${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["JOURNAL_ENTRIES"],
        }),
    }),
});

export const {
    useGetJournalEntriesQuery,
    useCreateJournalEntryMutation,
    useUpdateJournalEntryMutation,
    useDeleteJournalEntryMutation,
} = journalEntryEndpoints;
