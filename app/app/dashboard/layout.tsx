"use client";

import { ReactNode, useState } from "react";
import Sidebar from "./sidebar";
import ReduxProvider from "@/redux/provider"

export default function InnerLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navigation */}

      <div className="flex">
        {/* Sidebar */}
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 p-6 ${collapsed ? "ml-20" : "ml-64"
            }`}
        >
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </main>
      </div>
    </div>
  );
}
