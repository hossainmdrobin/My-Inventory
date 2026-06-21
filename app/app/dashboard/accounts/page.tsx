"use client";
import { useState } from "react";
import FinancialSummaryCard from "./FinancialSummaryCard";
import BankAccountTable from "./BankAccountTable";
import SupplierAccountSummary from "./SupplierAccountSummary";
import PaymentModal from "./PaymentModal";
import CashInflowModal from "./CashInflowModal";
import CashTransferModal from "./CashOutflowModal";
import SupplierBalanceModal from "./SupplierBalanceModal";
import { Supplier } from "@/types/supplier";
import { useGetSuppliersQuery, useGetBanksQuery, useUpdateSupplierMutation, useUpdateBankMutation, useDeleteBankMutation } from "@/redux/slices/api.slices";
import SkeletonTable from "@/reusable/skeletone";
import ErrorState from "@/reusable/ErrorState";
import { useGetMeQuery } from "@/redux/slices/auth/api.auth";
import { useCreateJournalEntryMutation } from "@/redux/slices/journalEntry/api.entry";
import JournalTable from "./JournalTable";

export default function AccountsPage() {
    const [supplierSearch, setSupplierSearch] = useState("");

    const { data: profile } = useGetMeQuery()
    const { data: suppliers, error: supplierError, isLoading: supplierLoading } = useGetSuppliersQuery({ key: supplierSearch });
    const { data: banks, error: bankError, isLoading: bankLoading } = useGetBanksQuery();
    const [updateSupplier] = useUpdateSupplierMutation();
    const [updateBank] = useUpdateBankMutation();
    const [deleteBank] = useDeleteBankMutation();

    const [createJournalEntry, { error: journalEntryError }] = useCreateJournalEntryMutation();
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [paymentNote, setPaymentNote] = useState("");

    const [inflowModalOpen, setInflowModalOpen] = useState(false);
    const [inflowAmount, setInflowAmount] = useState(0);
    const [inflowBank, setInflowBank] = useState<string>("");
    const [inflowNote, setInflowNote] = useState("");

    const [outflowModalOpen, setOutflowModalOpen] = useState(false);

    const [supplierBalanceModalOpen, setSupplierBalanceModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [supplierPayable, setSupplierPayable] = useState(0);
    const [supplierReceivable, setSupplierReceivable] = useState(0);

    const [journalModalOpen, setJournalModalOpen] = useState(false);
    const [journalAmount, setJournalAmount] = useState(0);
    const [journalDescription, setJournalDescription] = useState("");
    const [journalAccountId, setJournalAccountId] = useState<string>("");
    const [journalType, setJournalType] = useState<"debit" | "credit">("debit");

    const totalCash = banks?.reduce((sum, b) => sum + (b.balance || 0), 0) || 0;
    const totalPayable = suppliers?.reduce((sum, s) => sum + (s.accountPayable || 0), 0) || 0;
    const totalAdvance = suppliers?.reduce((sum, s) => sum + (s.advance || 0), 0) || 0;
    const netWorth = totalCash + totalAdvance - totalPayable;

    const openInflowModal = () => {
        setInflowAmount(0);
        setInflowBank(banks?.[0]?._id || "");
        setInflowNote("");
        setInflowModalOpen(true);
    };

    const handleInflowSubmit = () => {
        setInflowModalOpen(false);
    };

    const openPaymentModal = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setPaymentAmount(supplier.due || 0);
        setPaymentNote("");
        setPaymentModalOpen(true);
    };

    const handlePaymentSubmit = () => {
        setPaymentModalOpen(false);
    };

    const openSupplierBalanceModal = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setSupplierPayable(supplier.accountPayable || 0);
        setSupplierReceivable(supplier.accountReceivable || 0);
        setSupplierBalanceModalOpen(true);
    };

    const handleSupplierBalanceSubmit = () => {
        if (editingSupplier?._id) {
            updateSupplier({ id: editingSupplier._id, data: { accountPayable: supplierPayable, accountReceivable: supplierReceivable } });
        }
        setSupplierBalanceModalOpen(false);
    };

    const openJournalModal = () => {
        setJournalAmount(0);
        setJournalDescription("");
        setJournalAccountId(banks?.[0]?._id || "");
        setJournalType("debit");
        setJournalModalOpen(true);
    };

    const handleJournalSubmit = async () => {
        if (!journalAccountId || journalAmount <= 0) return;
        await createJournalEntry({
            data: {
                account: journalAccountId,
                description: journalDescription,
                amount: journalAmount,
                type: journalType,
            },
        });
        setJournalModalOpen(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <h1 className="text-2xl font-bold">Accounts</h1>
                <div className="flex gap-2">
                    <button
                        onClick={openJournalModal}
                        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                    >
                        Journal Entry
                    </button>
                    <button
                        onClick={openInflowModal}
                        className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
                    >
                        Transfer
                    </button>
                    <button
                        onClick={() => setOutflowModalOpen(true)}
                        className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                    >
                        Transfer
                    </button>
                </div>
            </div>
            <JournalTable />

            <section>
                <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FinancialSummaryCard
                        title="Total Cash"
                        amount={profile?.institute?.totalCashValue || 0}
                        subtitle="Across all bank accounts"
                    />
                    <FinancialSummaryCard
                        title="Total Payable"
                        amount={totalPayable}
                        subtitle="Amount owed to suppliers"
                    />
                    <FinancialSummaryCard
                        title="Net Business Worth"
                        amount={netWorth}
                        subtitle="Cash + Advances - Payables"
                    />
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">Bank Accounts</h2>
                {bankLoading && <SkeletonTable />}
                {bankError && <ErrorState />}
                {banks && (
                    <BankAccountTable
                        accounts={banks}
                        onSave={(id, data) => updateBank({ id, data })}
                        onDelete={(id) => deleteBank({ id })}
                    />
                )}
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">Supplier Accounts</h2>
                <input
                    type="text"
                    placeholder="Search suppliers..."
                    value={supplierSearch}
                    onChange={(e) => setSupplierSearch(e.target.value)}
                    className="w-full md:w-64 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2 mb-4"
                />
                {supplierLoading && <SkeletonTable />}
                {supplierError && <ErrorState />}
                {suppliers && (
                    <SupplierAccountSummary
                        suppliers={suppliers}
                        onRecordPayment={openPaymentModal}
                        onUpdateBalances={openSupplierBalanceModal}
                    />
                )}
            </section>

            

            <PaymentModal
                open={paymentModalOpen}
                supplier={selectedSupplier}
                amount={paymentAmount}
                note={paymentNote}
                setAmount={setPaymentAmount}
                setNote={setPaymentNote}
                onClose={() => setPaymentModalOpen(false)}
                onSubmit={handlePaymentSubmit}
            />

            <CashInflowModal
                open={inflowModalOpen}
                banks={banks || []}
                amount={inflowAmount}
                selectedBank={inflowBank}
                note={inflowNote}
                setAmount={setInflowAmount}
                setSelectedBank={setInflowBank}
                setNote={setInflowNote}
                onClose={() => setInflowModalOpen(false)}
                onSubmit={handleInflowSubmit}
            />

            <CashTransferModal
                open={outflowModalOpen}
                banks={banks || []}
                onClose={() => setOutflowModalOpen(false)}
            />

            <SupplierBalanceModal
                open={supplierBalanceModalOpen}
                supplier={editingSupplier}
                accountPayable={supplierPayable}
                accountReceivable={supplierReceivable}
                setAccountPayable={setSupplierPayable}
                setAccountReceivable={setSupplierReceivable}
                onClose={() => setSupplierBalanceModalOpen(false)}
                onSubmit={handleSupplierBalanceSubmit}
            />

            {journalModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Create Journal Entry</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Account</label>
                                <select
                                    value={journalAccountId}
                                    onChange={(e) => setJournalAccountId(e.target.value)}
                                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2"
                                >
                                    <option value="">Select Account</option>
                                    {banks?.map((bank) => (
                                        <option key={bank._id} value={bank._id}>
                                            {bank.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={journalDescription}
                                    onChange={(e) => setJournalDescription(e.target.value)}
                                    placeholder="Enter description"
                                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Type</label>
                                <select
                                    value={journalType}
                                    onChange={(e) => setJournalType(e.target.value as "debit" | "credit")}
                                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2"
                                >
                                    <option value="debit">Debit</option>
                                    <option value="credit">Credit</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Amount</label>
                                <input
                                    type="number"
                                    value={journalAmount}
                                    onChange={(e) => setJournalAmount(Number(e.target.value))}
                                    placeholder="Enter amount"
                                    min="0"
                                    step="0.01"
                                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => setJournalModalOpen(false)}
                                className="flex-1 rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white hover:bg-slate-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleJournalSubmit}
                                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}