"use client";

import { useState } from "react";
import { useGetMeQuery } from "@/redux/slices/auth/api.auth";
import { useGetInstitutesQuery } from "@/redux/slices/settings/api.setting";
import ProfileSection from "./components/ProfileSection";
import UsersTable from "./components/UsersTable";
import CategoriesSection from "./components/CategoriesSection";

export default function SettingsPage() {
  const { data: me } = useGetMeQuery();
  const { data: institutes } = useGetInstitutesQuery();

  const [categories, setCategories] = useState<string[]>([
    "Clothing",
    "Footwear",
    "Accessories",
  ]);

  const currentUserId = me?._id || "";

  const addCategory = (category: string) => {
    setCategories((prev) => [...prev, category]);
  };

  const deleteCategory = (cat: string) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold text-slate-100">Settings</h1>

      <ProfileSection onUserUpdated={() => {}} />

      <UsersTable
        currentUserId={currentUserId}
        institutes={institutes || []}
        onUserUpdated={() => {}}
      />

      <CategoriesSection
        categories={categories}
        onAdd={addCategory}
        onDelete={deleteCategory}
      />
    </div>
  );
}
