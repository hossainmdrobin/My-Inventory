"use client";

import { useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Staff";
};

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Robin Hossain", email: "robin@example.com", role: "Admin" },
    { id: 2, name: "John Doe", email: "john@example.com", role: "Manager" },
    { id: 3, name: "Jane Smith", email: "jane@example.com", role: "Staff" },
  ]);

  const [categories, setCategories] = useState<string[]>([
    "Clothing",
    "Footwear",
    "Accessories",
  ]);

  const [newCategory, setNewCategory] = useState("");

  /* ---------- User Role Management ---------- */
  function changeUserRole(id: number, newRole: User["role"]) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  }

  function deleteUser(id: number) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  /* ---------- Category Management ---------- */
  function addCategory() {
    if (newCategory.trim() === "") return;
    setCategories((prev) => [...prev, newCategory.trim()]);
    setNewCategory("");
  }

  function deleteCategory(cat: string) {
    setCategories((prev) => prev.filter((c) => c !== cat));
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {/* Users Management */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Manage Users & Roles</h2>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="min-w-[700px] w-full text-sm">
            <thead className="bg-slate-900 text-slate-300">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-slate-800 hover:bg-slate-900/50"
                >
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        changeUserRole(user.id, e.target.value as User["role"])
                      }
                      className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg text-slate-200"
                    >
                      <option>Admin</option>
                      <option>Manager</option>
                      <option>Staff</option>
                    </select>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Categories Management */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Manage Product Categories</h2>

        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="New category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-2 outline-none flex-1"
          />
          <button
            onClick={addCategory}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold text-white"
          >
            Add
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="min-w-[400px] w-full text-sm">
            <thead className="bg-slate-900 text-slate-300">
              <tr>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((cat, idx) => (
                <tr
                  key={idx}
                  className="border-t border-slate-800 hover:bg-slate-900/50"
                >
                  <td className="p-3">{cat}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => deleteCategory(cat)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={2} className="p-4 text-center text-slate-400">
                    No categories.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
