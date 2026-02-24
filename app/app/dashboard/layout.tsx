"use client";

import { ReactNode, useState } from "react";
import Sidebar from "./sidebar";
import ReduxProvider from "@/redux/provider"
import SidebarMd from "./sidebarMd";
import { Menu, X } from "lucide-react";

export default function InnerLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Top Navigation */}

      <div className="flex">
        {/* Sidebar */}
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <SidebarMd collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Main Content */}
        <main
          className={`flex-1 transition-all w-screen duration-300 pr-2 pl-2 ${collapsed ? "md:pl-22" : "md:pl-66"
            }`}
        >
          <ReduxProvider>
            <div className="flex justify-end items-center fixed right-4 top-3 md:hidden z-50">
              {
                collapsed ? <button onClick={() => setCollapsed(false)} className="md:hidden mb-4"><Menu /></button>
                  : <button onClick={() => setCollapsed(true)} className="md:hidden mb-4"><X /></button>
              }
            </div>
            <div className="mt-4">
              {children}

            </div>

          </ReduxProvider>
        </main>
      </div>
    </div>
  );
}
