"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Link href="/" className="text-lg font-bold tracking-tight text-white">
              Panne <span className="text-purple-400">Commissions</span>
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              VRChat avatar commission service
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
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
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Panne Commissions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
