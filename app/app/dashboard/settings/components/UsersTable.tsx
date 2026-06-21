"use client";

import { useState } from "react";
import { useGetUsersQuery, useUpdateUserMutation } from "@/redux/slices/auth/api.auth";
import type { UserWithInstitute, Institute } from "@/types/user";
import UserModal from "./UserModal";

type UsersTableProps = {
  currentUserId: string;
  institutes: Institute[];
  onUserUpdated: () => void;
};

export default function UsersTable({ currentUserId, institutes, onUserUpdated }: UsersTableProps) {
  const { data: usersResponse, isLoading, error } = useGetUsersQuery({});
  const [updateUser] = useUpdateUserMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithInstitute | null>(null);

  const users = usersResponse?.data || [];

  const otherUsers = users.filter((u) => u._id !== currentUserId);

  const openEditModal = (user: UserWithInstitute) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleSave = async (data: {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    password?: string;
    institute?: string;
  }) => {
    if (!selectedUser) return;
    await updateUser({
      id: selectedUser._id,
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        ...(data.password ? { password: data.password } : {}),
        institute: data.institute,
      },
    }).unwrap();
    onUserUpdated();
  };

  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">Manage Users</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-400">
          Loading users...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">Manage Users</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-red-400">
          Failed to load users.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-100">Manage Users</h2>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-[700px] w-full text-sm">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Institute</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {otherUsers.map((user) => {
              const role = user.role || "employee";
              const instituteName =
                typeof user.institute === "string" ? user.institute : user.institute?.name || "N/A";

              return (
                <tr
                  key={user._id}
                  className="border-t border-slate-800 hover:bg-slate-900/50"
                >
                  <td className="p-3 text-slate-200">{user.name || "N/A"}</td>
                  <td className="p-3 text-slate-300">{user.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 capitalize">
                      {role}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{instituteName}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => openEditModal(user)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}

            {otherUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-400">
                  No other users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <UserModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSave={handleSave}
        institutes={institutes}
      />
    </section>
  );
}
