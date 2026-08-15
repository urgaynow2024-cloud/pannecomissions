"use client";

import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";

const titles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/portfolio": "Portfolio",
  "/admin/nsfw": "NSFW Portfolio",
  "/admin/reviews": "Reviews",
  "/admin/pricing": "Pricing",
  "/admin/commissions": "Commissions",
  "/admin/support": "Support",
  "/admin/media": "Media Library",
  "/admin/trash": "Trash",
  "/admin/system": "System Status",
  "/admin/content": "Content",
  "/admin/services": "Services",
  "/admin/settings": "Settings",
};

export default function AdminTopBar({ username }: { username: string }) {
  const pathname = usePathname();
  const title = titles[pathname] || "Admin";

  return (
    <header className="h-14 border-b border-white/5 bg-brand-dark flex items-center justify-between px-6 shrink-0">
      <h2 className="text-sm font-semibold text-white font-display">{title}</h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-xs text-gray-400">Online</span>
        </div>
        <a href="/" target="_blank" className="text-xs text-brand-purple-400 hover:text-brand-purple-300 transition-colors flex items-center gap-1">
          View Website
          <ExternalLink className="h-3 w-3" />
        </a>
        <div className="h-4 w-px bg-white/10" />
        <span className="text-xs text-gray-400">{username}</span>
      </div>
    </header>
  );
}
