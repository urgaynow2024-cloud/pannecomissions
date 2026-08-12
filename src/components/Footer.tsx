"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/" className="text-lg font-bold tracking-tight text-white">
              Panne <span className="text-purple-400">Commissions</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              VRChat avatar commissions.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Work</h3>
            <div className="space-y-3">
              <Link href="/portfolio" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Portfolio
              </Link>
              <Link href="/services" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Services
              </Link>
              <Link href="/pricing" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/reviews" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Reviews
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Commission</h3>
            <div className="space-y-3">
              <Link href="/commission" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Commission
              </Link>
              <Link href="/contact" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/support" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Support
              </Link>
              <Link href="/nsfw" className="block text-sm text-gray-400 hover:text-white transition-colors">
                18+ NSFW
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Site</h3>
            <div className="space-y-3">
              <Link href="/" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/portfolio" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Portfolio
              </Link>
              <Link href="/services" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Services
              </Link>
              <Link href="/pricing" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/reviews" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Reviews
              </Link>
              <Link href="/commission" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Commission
              </Link>
              <Link href="/contact" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/support" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Support
              </Link>
              <Link href="/nsfw" className="block text-sm text-gray-400 hover:text-white transition-colors">
                18+ NSFW
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Panne Commissions
          </p>
          <Link
            href="/commission"
            className="inline-flex items-center rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-500"
          >
            Commission Me
          </Link>
        </div>
      </div>
    </footer>
  );
}
