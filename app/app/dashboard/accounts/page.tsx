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

export default function AccountsPage() {
    const [supplierSearch, setSupplierSearch] = useState("");

    const { data: profile } = useGetMeQuery()
    const { data: suppliers, error: supplierError, isLoading: supplierLoading } = useGetSuppliersQuery({ key: supplierSearch });
    const { data: banks, error: bankError, isLoading: bankLoading } = useGetBanksQuery();
    const [updateSupplier] = useUpdateSupplierMutation();
    const [updateBank] = useUpdateBankMutation();
    const [deleteBank] = useDeleteBankMutation();

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

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <h1 className="text-2xl font-bold">Accounts</h1>
                <div className="flex gap-2">
                    <button
                        onClick={openInflowModal}
                        className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
                    >
                        + Add Cash
                    </button>
                    <button
                        onClick={() => setOutflowModalOpen(true)}
                        className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                    >
                        + Transfer Cash
                    </button>
                </div>
            </div>

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
                suppliers={suppliers || []}
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
        </div>
    );
}