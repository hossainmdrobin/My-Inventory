"use client";

import { ReactNode, useState } from "react";
import Sidebar from "./sidebar";
import ReduxProvider from "@/redux/provider"

export default function InnerLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Top Navigation */}

      <div className="flex">
        {/* Sidebar */}
        {/* <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} /> */}

        {/* Main Content */}
        <main
          className={`flex-1 transition-all w-screen duration-300 pr-2 ${collapsed ? "pl-22" : "pl-64"
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
