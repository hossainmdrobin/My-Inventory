
export type CreateTransactionDTO = {
    amount: number;
    source?: string;
    sourceWallet: string;
    sourceSupplier?: string;
    destinationWallet: string;
    destinationSupplier?: string;
    note?: string;
};

export type TransactionResponse = {
    _id: string;
    user: string;
    amount: number;
    source: string;
    sourceWallet?: string;
    sourceSupplier?: string;
    destinationWallet?: string;
    destinationSupplier?: string;
    note?: string;
    newAmmount?: number;
    createdAt: string;
    updatedAt: string;
};
