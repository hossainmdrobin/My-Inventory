"use client";

import { useState } from "react";
import { useGetMeQuery } from "@/redux/slices/auth/api.auth";
import { useGetInstitutesQuery, useGetWalletsQuery, useUpdateDefaultAccountsMutation } from "@/redux/slices/settings/api.setting";

type DefaultAccountsSectionProps = {
  onSaved?: () => void;
};

export default function DefaultAccountsSection({ onSaved }: DefaultAccountsSectionProps) {
  const { data: me } = useGetMeQuery();
  const { data: institutes } = useGetInstitutesQuery();
  const instituteId = me?.institute?._id || institutes?.[0]?._id;

  const { data: wallets, isLoading: walletsLoading } = useGetWalletsQuery(
    { instituteId: instituteId || "" },
    { skip: !instituteId }
  );
  const [updateDefaults, { isLoading: saving }] = useUpdateDefaultAccountsMutation();

  const [salesAccount, setSalesAccount] = useState("");
  const [salesCostAccount, setSalesCostAccount] = useState("");
  const [returnAccount, setReturnAccount] = useState("");
  const [error, setError] = useState("");

  if (!instituteId) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">Default Accounts</h2>
        <div className="rounded-lg bg-slate-900 border border-slate-800 p-6 text-slate-400">
          No institute found. Please contact an administrator.
        </div>
      </section>
    );
  }

  if (walletsLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">Default Accounts</h2>
        <div className="rounded-lg bg-slate-900 border border-slate-800 p-6 text-slate-400">
          Loading accounts...
        </div>
      </section>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await updateDefaults({
        salesAccount,
        salesCostAccount,
        returnAccount,
      }).unwrap();
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update default accounts");
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-100">Default Accounts</h2>
      <p className="text-sm text-slate-400">
        Select the default accounts used for sales, cost, and return transactions.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm text-slate-300 mb-1">Sales Account</label>
          <select
            value={salesAccount}
            onChange={(e) => setSalesAccount(e.target.value)}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-200 outline-none focus:border-blue-500"
            required
          >
            <option value="">Select Sales Account</option>
            {wallets?.map((wallet) => (
              <option key={wallet._id} value={wallet._id}>
                {wallet.name} ({wallet.type})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Sales Cost Account</label>
          <select
            value={salesCostAccount}
            onChange={(e) => setSalesCostAccount(e.target.value)}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-200 outline-none focus:border-blue-500"
            required
          >
            <option value="">Select Sales Cost Account</option>
            {wallets?.map((wallet) => (
              <option key={wallet._id} value={wallet._id}>
                {wallet.name} ({wallet.type})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Return Account</label>
          <select
            value={returnAccount}
            onChange={(e) => setReturnAccount(e.target.value)}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-200 outline-none focus:border-blue-500"
            required
          >
            <option value="">Select Return Account</option>
            {wallets?.map((wallet) => (
              <option key={wallet._id} value={wallet._id}>
                {wallet.name} ({wallet.type})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Default Accounts"}
        </button>
      </form>
    </section>
  );
}
