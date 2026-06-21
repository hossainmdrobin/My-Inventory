"use client";

import { useState } from "react";
import { useGetMeQuery, useUpdateUserMutation } from "@/redux/slices/auth/api.auth";

type ProfileSectionProps = {
  onUserUpdated: () => void;
};

export default function ProfileSection({ onUserUpdated }: ProfileSectionProps) {
  const { data: user, isLoading, error } = useGetMeQuery();
  const [updateUser, { isLoading: saving }] = useUpdateUserMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">My Profile</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-400">
          Loading profile...
        </div>
      </section>
    );
  }

  if (error || !user) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">My Profile</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-red-400">
          Unable to load profile.
        </div>
      </section>
    );
  }

  const startEdit = () => {
    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setPassword("");
    setErrorMsg("");
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      await updateUser({
        id: user._id,
        data: {
          name,
          email,
          phone,
          ...(password ? { password } : {}),
        },
      }).unwrap();
      setIsEditing(false);
      onUserUpdated();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  const instituteName =
    typeof user.institute === "string" ? user.institute : user.institute?.name || "N/A";

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-100">My Profile</h2>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        {!isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Name</p>
                <p className="text-slate-200 font-medium">{user.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Email</p>
                <p className="text-slate-200 font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Phone</p>
                <p className="text-slate-200 font-medium">{user.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Role</p>
                <p className="text-slate-200 font-medium capitalize">
                  {user.role || "employee"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Institute</p>
                <p className="text-slate-200 font-medium">{instituteName}</p>
              </div>
            </div>

            <button
              onClick={startEdit}
              className="mt-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-3 py-2">
                {errorMsg}
              </p>
            )}

            <div>
              <label className="block text-sm text-slate-300 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-200 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-200 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-200 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">
                New Password{" "}
                <span className="text-slate-500">(leave blank to keep current)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-200 outline-none focus:border-blue-500"
                placeholder="New password (optional)"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
