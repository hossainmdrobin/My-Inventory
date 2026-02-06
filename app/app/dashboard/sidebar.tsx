import {
    LayoutDashboard,
    Users,
    Package,
    Settings,
    LogOut,
    Home,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const menu = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/app/dashboard" },
    { name: "Employees", icon: Users, href: "/app/dashboard/employees" },
    { name: "Products", icon: Package, href: "/app/dashboard/products" },
    { name: "Purchases", icon: Settings, href: "/app/dashboard/purchases" },
    { name: "Sales", icon: Users, href: "/app/dashboard/sales" },
    { name: "Suppliers", icon: Package, href: "/app/dashboard/suppliers" },
    { name: "Reports", icon: Settings, href: "/app/dashboard/reports" },
    { name: "Settings", icon: Settings, href: "/app/dashboard/settings" },
];

export default function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (collapsed: boolean) => void }) {
    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-slate-900/80 backdrop-blur-md border-r border-white/10 transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}`}
        >
            <nav className="p-4 space-y-2">
                <div className="flex items-center justify-between ">
                    <span
                        className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-slate-300 hover:bg-white/10 hover:text-white transition"
                    >
                        <div className="w-full flex items-center justify-center">
                            {!collapsed && <span>Brand</span>}
                            {!collapsed && <ChevronLeft size={20} onClick={() => setCollapsed(true)} />}
                            {collapsed && <ChevronRight size={20} onClick={() => setCollapsed(false)} />}
                        </div>
                    </span>
                </div>
                {menu.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 hover:bg-white/10 hover:text-white transition"
                    >
                        <item.icon size={20} />
                        {!collapsed && <span>{item.name}</span>}
                    </a>
                ))}

                <div className="pt-4 mt-4 border-t border-white/10">
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-400 hover:bg-red-500/10 transition">
                        <LogOut size={20} />
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </nav>
        </aside>
    );
}
