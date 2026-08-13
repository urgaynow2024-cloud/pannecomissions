"use client";

import Link from "next/link";

export default function AvailabilityIndicator() {
  return (
    <Link
      href="/commission"
      className="inline-flex items-center gap-2.5 group"
      aria-label="Currently accepting commissions"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
      </span>
      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">
        Accepting Commissions
      </span>
    </Link>
  );
}
