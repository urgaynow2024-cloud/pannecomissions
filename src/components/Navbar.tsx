"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/portfolio", label: "Portfolio" },
    { href: "/services", label: "Services" },
    { href: "/pricing", label: "Pricing" },
    { href: "/reviews", label: "Reviews" },
    { href: "/contact", label: "Contact" },
    { href: "/support", label: "Support" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            href="/"
            className="text-lg md:text-xl font-bold tracking-tight text-white font-display group"
          >
            PANNE
            <span className="text-brand-purple-400 group-hover:text-brand-purple-300 transition-colors">
              {" "}Commissions
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm text-gray-400 hover:text-white transition-colors duration-200 py-1 group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-brand-purple-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <Link
              href="/nsfw"
              className="text-sm text-gray-500 hover:text-red-400 transition-colors duration-200"
            >
              18+ NSFW
            </Link>
            <Link
              href="/commission"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-brand-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-purple-400 hover:shadow-lg hover:shadow-brand-purple-500/25"
            >
              <span className="relative z-10 flex items-center gap-2">
                Commission Me
                <svg
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <Link
              href="/commission"
              className="text-sm font-semibold text-brand-purple-400 hover:text-brand-purple-300 transition-colors"
            >
              Commission Me
            </Link>
            <button
              className="relative w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-4">
                <span
                  className={`absolute left-0 w-5 h-px bg-current transition-all duration-300 ${
                    mobileOpen ? "top-2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-2 w-5 h-px bg-current transition-all duration-300 ${
                    mobileOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 w-5 h-px bg-current transition-all duration-300 ${
                    mobileOpen ? "top-2 -rotate-45" : "top-4"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-white/5 bg-black/95 backdrop-blur-xl animate-fade-in-up">
          <div className="px-6 py-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-base text-gray-400 hover:text-white transition-colors border-b border-white/5 last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/nsfw"
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-base text-gray-500 hover:text-red-400 transition-colors border-b border-white/5"
            >
              18+ NSFW
            </Link>
            <div className="pt-4">
              <Link
                href="/commission"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center rounded-full bg-brand-purple-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-purple-400 transition-colors"
              >
                Commission Me
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
