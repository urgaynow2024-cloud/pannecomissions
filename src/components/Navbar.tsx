"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-white">
            Panne <span className="text-purple-400">Commissions</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/portfolio" className="text-sm text-gray-400 transition-colors hover:text-white">
              Portfolio
            </Link>
            <Link href="/reviews" className="text-sm text-gray-400 transition-colors hover:text-white">
              Reviews
            </Link>
            <Link href="/contact" className="text-sm text-gray-400 transition-colors hover:text-white">
              Contact
            </Link>
            <Link href="/support" className="text-sm text-gray-400 transition-colors hover:text-white">
              Support
            </Link>
            <Link href="/nsfw" className="text-sm text-gray-400 transition-colors hover:text-white">
              NSFW
            </Link>
          </div>

          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 py-4 space-y-1">
            <Link href="/portfolio" className="block px-2 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              Portfolio
            </Link>
            <Link href="/reviews" className="block px-2 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              Reviews
            </Link>
            <Link href="/contact" className="block px-2 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/support" className="block px-2 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              Support
            </Link>
            <Link href="/nsfw" className="block px-2 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              NSFW
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
