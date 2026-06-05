"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname(); // /dashboard/employees
  const isApp = pathname.split('/').includes('app');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    // Check if the user is logged in by calling the /api/auth/me endpoint
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setIsLoggedIn(true);
        else setIsLoggedIn(false);
      })
      .catch(() => {
        setIsLoggedIn(false)
      });
  }, []);


  const links = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return isApp ? <></> : (
    <header className="fixed top-0 left-0 z-50 w-full">
      <nav className="backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Brand */}
            <Link
              href="/"
              className="text-xl font-bold text-white tracking-wide"
            >
              Sathi Enterprise
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-slate-200 hover:text-white transition"
                >
                  {link.name}
                </Link>
              ))}
              {isLoggedIn &&
                <Link
                  className="text-sm font-medium text-slate-200 hover:text-white transition"
                  href="/app/dashboard">Dashboard</Link>
              }
              {!isLoggedIn && <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-200 hover:text-white transition"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition"
                >
                  Signup
                </Link>
              </>}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-white"
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden backdrop-blur-md bg-black/60 border-t border-white/10">
            <div className="px-6 py-4 space-y-4">
              {[...links, { name: "Login", href: "/login" }].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-slate-200 hover:text-white transition"
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <Link
                href="/app/auth"
                className="block text-center rounded-lg bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600 transition"
                onClick={() => setOpen(false)}
              >
                Signup
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
