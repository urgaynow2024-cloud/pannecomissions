"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Image,
  Shield,
  Star,
  DollarSign,
  ClipboardList,
  HelpCircle,
  ExternalLink,
  LogOut,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/portfolio", label: "Portfolio", icon: Image },
  { href: "/admin/nsfw", label: "NSFW Portfolio", icon: Shield },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/pricing", label: "Pricing", icon: DollarSign },
  { href: "/admin/commissions", label: "Commissions", icon: ClipboardList },
  { href: "/admin/support", label: "Support", icon: HelpCircle },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 md:hidden bg-brand-purple-500 text-white p-2.5 rounded-xl border border-white/10 shadow-lg"
        aria-label="Toggle menu"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-[260px] bg-brand-dark border-r border-white/5 transform transition-transform duration-200 ease-in-out
          md:translate-x-0 md:static md:z-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 border-b border-white/5">
          <Link href="/admin" className="block" onClick={() => setOpen(false)}>
            <h1 className="text-lg font-bold tracking-tight text-white font-display">
              PANNE
              <br />
              <span className="text-brand-purple-400">CREATOR STUDIO</span>
            </h1>
            <div className="mt-2 h-0.5 w-8 bg-brand-purple-500 rounded-full" />
          </Link>
        </div>

        <nav className="p-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                  isActive
                    ? "bg-brand-purple-500/10 text-brand-purple-400"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-purple-500 rounded-r-full" />
                )}
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/5 space-y-0.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <ExternalLink className="h-5 w-5 shrink-0" />
            View Website
          </Link>
          <form action="/api/admin/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-200"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              Log Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
