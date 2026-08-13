"use client";

import Link from "next/link";

const footerLinks = [
  {
    title: "Work",
    links: [
      { href: "/portfolio", label: "Portfolio" },
      { href: "/services", label: "Services" },
      { href: "/pricing", label: "Pricing" },
      { href: "/reviews", label: "Reviews" },
    ],
  },
  {
    title: "Commission",
    links: [
      { href: "/commission", label: "Commission" },
      { href: "/contact", label: "Contact" },
      { href: "/support", label: "Support" },
      { href: "/nsfw", label: "18+ NSFW" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-brand-dark">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block text-xl font-bold tracking-tight text-white font-display group">
              PANNE
              <br />
              <span className="text-brand-purple-400 group-hover:text-brand-purple-300 transition-colors">
                Commissions
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-xs">
              VRChat avatar commissions. Custom work for your avatar.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-4">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Panne Commissions
          </p>
          <Link
            href="/commission"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-brand-purple-500 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-purple-400 hover:shadow-lg hover:shadow-brand-purple-500/25"
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
      </div>
    </footer>
  );
}
