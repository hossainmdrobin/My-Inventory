"use client";

import { useState } from "react";
import { useGetMeQuery } from "@/redux/slices/auth/api.auth";
import { useGetInstitutesQuery } from "@/redux/slices/settings/api.setting";
import ProfileSection from "./components/ProfileSection";
import UsersTable from "./components/UsersTable";
import CategoriesSection from "./components/CategoriesSection";

type Tab = "profile" | "default_accounts" | "others";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const { data: me } = useGetMeQuery();
  const { data: institutes } = useGetInstitutesQuery();

  const currentUserId = me?._id || "";

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-slate-100">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-2">
        <TabBtn label="Profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
        <TabBtn label="Default accounts" active={activeTab === "default_accounts"} onClick={() => setActiveTab("default_accounts")} />
        <TabBtn label="Others" active={activeTab === "others"} onClick={() => setActiveTab("others")} />
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <section className="space-y-8">
          <ProfileSection onUserUpdated={() => {}} />

          <UsersTable
            currentUserId={currentUserId}
            institutes={institutes || []}
            onUserUpdated={() => {}}
          />

          <CategoriesSection
            categories={["Clothing", "Footwear", "Accessories"]}
            onAdd={() => {}}
            onDelete={() => {}}
          />
        </section>
      )}

      {/* Default accounts Tab */}
      {activeTab === "default_accounts" && (
        <section className="space-y-4">
          <div className="rounded-lg bg-slate-900 border border-slate-800 p-6 text-slate-400">
            Default accounts configuration coming soon.
          </div>
        </section>
      )}

      {/* Others Tab */}
      {activeTab === "others" && (
        <section className="space-y-4">
          <div className="rounded-lg bg-slate-900 border border-slate-800 p-6 text-slate-400">
            Additional settings coming soon.
          </div>
        </section>
      )}
    </div>
  );
}

function TabBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-t-lg -mb-px border-b-2 ${
        active ? "border-blue-600 text-blue-600 bg-slate-900" : "border-transparent text-slate-400 bg-transparent"
      }`}
    >
      {label}
    </button>
  );
}
