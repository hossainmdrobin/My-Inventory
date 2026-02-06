"use client";

import { useState } from "react";

type Tab = "login" | "signup";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<Tab>("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 space-y-6">
        {/* Tabs */}
        <div className="flex rounded-xl overflow-hidden border border-slate-800">
          <TabButton label="Login" active={activeTab === "login"} onClick={() => setActiveTab("login")} />
          <TabButton label="Signup" active={activeTab === "signup"} onClick={() => setActiveTab("signup")} />
        </div>

        {/* Forms */}
        {activeTab === "login" && <LoginForm />}
        {activeTab === "signup" && <SignupForm />}
      </div>
    </div>
  );
}

/* ---------------- Tabs ---------------- */

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-1/2 py-2 font-semibold transition ${
        active
          ? "bg-blue-600 text-white"
          : "bg-slate-900 text-slate-400 hover:bg-slate-800"
      }`}
    >
      {label}
    </button>
  );
}

/* ---------------- Login ---------------- */

function LoginForm() {
  return (
    <form className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Welcome Back</h2>

      <Input label="Email" type="email" placeholder="you@example.com" />
      <Input label="Password" type="password" placeholder="••••••••" />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded-lg font-semibold"
      >
        Login
      </button>
    </form>
  );
}

/* ---------------- Signup ---------------- */

function SignupForm() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
  }

  return (
    <form className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Create Account</h2>

      {/* Profile Photo */}
      <div className="flex flex-col items-center gap-2">
        <div className="h-24 w-24 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">
          {photoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoPreview} alt="Profile preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-slate-400 text-sm">Photo</span>
          )}
        </div>

        <label className="text-sm cursor-pointer text-blue-400 hover:underline">
          Upload photo
          <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
        </label>
      </div>

      <Input label="Name" placeholder="Your full name" />
      <Input label="Email" type="email" placeholder="you@example.com" />
      <Input label="Phone Number" type="tel" placeholder="+8801XXXXXXXXX" />
      <Input label="Password" type="password" placeholder="••••••••" />
      <Input label="Confirm Password" type="password" placeholder="••••••••" />

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 transition py-2 rounded-lg font-semibold"
      >
        Create Account
      </button>
    </form>
  );
}

/* ---------------- Reusable Input ---------------- */

function Input({
  label,
  type = "text",
  placeholder,
}: {
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-slate-300">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 outline-none focus:border-blue-500"
      />
    </div>
  );
}
