"use client";

import { useState } from "react";
import FinancialSummaryCard from "./FinancialSummaryCard";
import BankAccountTable from "./BankAccountTable";
import SupplierAccountSummary from "./SupplierAccountSummary";
import BankAccountForm from "./BankAccountForm";
import PaymentModal from "./PaymentModal";
import CashInflowModal from "./CashInflowModal";
import CashOutflowModal from "./CashOutflowModal";
import { BankAccount } from "@/types/bank";
import { Supplier } from "@/types/supplier";
import { useGetSuppliersQuery, useGetBanksQuery, useCreateBankMutation, useUpdateBankMutation, useDeleteBankMutation } from "@/redux/slices/api.slices";
import SkeletonTable from "@/reusable/skeletone";
import ErrorState from "@/reusable/ErrorState";

export default function AccountsPage() {
    const [bankSearch, setBankSearch] = useState("");
    const [supplierSearch, setSupplierSearch] = useState("");
    
    const [bankModalOpen, setBankModalOpen] = useState(false);
    const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
    const [bankForm, setBankForm] = useState<Partial<BankAccount>>({});
    
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [paymentNote, setPaymentNote] = useState("");

    const [inflowModalOpen, setInflowModalOpen] = useState(false);
    const [inflowAmount, setInflowAmount] = useState(0);
    const [inflowBank, setInflowBank] = useState<string>("");
    const [inflowNote, setInflowNote] = useState("");

    const [outflowModalOpen, setOutflowModalOpen] = useState(false);
    const [outflowAmount, setOutflowAmount] = useState(0);
    const [outflowDestination, setOutflowDestination] = useState<"bank" | "supplier">("bank");
    const [outflowBank, setOutflowBank] = useState<string>("");
    const [outflowSupplier, setOutflowSupplier] = useState<string>("");
    const [outflowNote, setOutflowNote] = useState("");

    const { data: suppliers, error: supplierError, isLoading: supplierLoading } = useGetSuppliersQuery({ key: supplierSearch });
    const { data: banks, error: bankError, isLoading: bankLoading } = useGetBanksQuery();
    const [createBank] = useCreateBankMutation();
    const [updateBank] = useUpdateBankMutation();
    const [deleteBank] = useDeleteBankMutation();

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

    const openOutflowModal = () => {
        setOutflowAmount(0);
        setOutflowDestination("bank");
        setOutflowBank(banks?.[0]?._id || "");
        setOutflowSupplier(suppliers?.[0]?._id || "");
        setOutflowNote("");
        setOutflowModalOpen(true);
    };

    const handleOutflowSubmit = () => {
        setOutflowModalOpen(false);
    };

    const openAddBankModal = () => {
        setEditingBank(null);
        setBankForm({ name: "", accountNumber: "", type: "Checking", balance: 0, notes: "" });
        setBankModalOpen(true);
    };

    const openEditBankModal = (bank: BankAccount) => {
        setEditingBank(bank);
        setBankForm(bank);
        setBankModalOpen(true);
    };

    const handleBankSubmit = () => {
        if (editingBank?._id) {
            updateBank({ id: editingBank._id, data: bankForm });
        } else {
            createBank({ data: bankForm });
        }
        setBankModalOpen(false);
    };

    const handleBankDelete = (id: string) => {
        deleteBank({ id });
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

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <h1 className="text-2xl font-bold">Accounts</h1>
                <div className="flex gap-2">
                    <button
                        onClick={openInflowModal}
                        className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
                    >
                        + Cash Inflow
                    </button>
                    <button
                        onClick={openOutflowModal}
                        className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                    >
                        + Cash Outflow
                    </button>
                    <button
                        onClick={openAddBankModal}
                        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                    >
                        + Add Bank Account
                    </button>
                </div>
            </div>

            <section>
                <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FinancialSummaryCard
                        title="Total Cash"
                        amount={totalCash}
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
                <input
                    type="text"
                    placeholder="Search bank accounts..."
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    className="w-full md:w-64 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2 mb-4"
                />
                {bankLoading && <SkeletonTable />}
                {bankError && <ErrorState />}
                {banks && (
                    <BankAccountTable
                        accounts={banks}
                        onEdit={openEditBankModal}
                        onDelete={handleBankDelete}
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
                    />
                )}
            </section>

            <BankAccountForm
                open={bankModalOpen}
                editing={editingBank}
                form={bankForm}
                setForm={setBankForm}
                onClose={() => setBankModalOpen(false)}
                onSubmit={handleBankSubmit}
            />

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

            <CashOutflowModal
                open={outflowModalOpen}
                banks={banks || []}
                suppliers={suppliers || []}
                destination={outflowDestination}
                selectedBank={outflowBank}
                selectedSupplier={outflowSupplier}
                amount={outflowAmount}
                note={outflowNote}
                setDestination={setOutflowDestination}
                setSelectedBank={setOutflowBank}
                setSelectedSupplier={setOutflowSupplier}
                setAmount={setOutflowAmount}
                setNote={setOutflowNote}
                onClose={() => setOutflowModalOpen(false)}
                onSubmit={handleOutflowSubmit}
            />
        </div>
    );
}