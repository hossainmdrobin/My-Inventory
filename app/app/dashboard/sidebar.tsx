import {
    LayoutDashboard,
    Users,
    Package,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ShoppingBasket,
    ShoppingBag,
    Handshake,
    FileChartColumn,
    IdCard,
    NotebookTabs,
    Landmark
} from "lucide-react";
import Link from "next/link";

export const menu = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/app/dashboard" },
    { name: "Transactions", icon: NotebookTabs, href: "/app/dashboard/accounts" },
    { name: "Chart of Accounts", icon: Landmark, href: "/app/dashboard/banks" },
    { name: "Employees", icon: Users, href: "/app/dashboard/employees" },
    { name: "Products", icon: Package, href: "/app/dashboard/products" },
    { name: "Purchases", icon: ShoppingBasket, href: "/app/dashboard/purchases" },
    { name: "Sales", icon: ShoppingBag, href: "/app/dashboard/sales" },
    { name: "Suppliers", icon: Handshake, href: "/app/dashboard/suppliers" },
    { name: "Customers", icon: IdCard, href: "/app/dashboard/customers" },
    { name: "Reports", icon: FileChartColumn, href: "/app/dashboard/reports" },
    { name: "Settings", icon: Settings, href: "/app/dashboard/settings" },
];

export default function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (collapsed: boolean) => void }) {
    return (
        <aside
            className={`hidden md:block fixed left-0 top-0 h-screen bg-slate-900/80 backdrop-blur-md border-r border-white/10 transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}`}
        >
            <nav className="p-4 space-y-2">
                <div className="flex items-center justify-between ">
                    <span
                        className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-slate-300 hover:bg-white/10 hover:text-white transition"
                    >
                        <div className="w-full flex items-center justify-center">
                            {
                                !collapsed && <div className="w-full flex items-center justify-between gap-2">
                                    <Link href={'/'}><span className="font-bold">Sathi Enterprise</span></Link>
                                    <ChevronLeft size={25} onClick={() => setCollapsed(true)} />
                                </div>
                            }
                            {collapsed && <ChevronRight size={25} onClick={() => setCollapsed(false)} />}
                        </div>
                    </span>
                </div>
                <hr />
                {menu.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 hover:bg-white/10 hover:text-white transition"
                    >
                        <item.icon size={20} />
                        {!collapsed && <span>{item.name}</span>}
                    </Link>
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
