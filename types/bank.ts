import { BankAccountType } from "./others";

export interface BankAccount {
    _id?: string;
    name: string;
    accountNumber: string;
    type: BankAccountType;
    balance: number;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}