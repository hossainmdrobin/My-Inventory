import { AccountTypeName, AccountCategory } from "./others";

export interface BankAccount {
    _id?: string;
    name: string;
    accountNumber?: string;
    accountType: AccountTypeName;
    category: AccountCategory;
    balance: number;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}