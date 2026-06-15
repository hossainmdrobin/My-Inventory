import { AccountTypeName, AccountCategory } from "./others";

export interface BankAccount {
    _id?: string;
    name: string;
    accountNumber?: string;
    type: AccountTypeName;
    category: AccountCategory;
    balance: number;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}