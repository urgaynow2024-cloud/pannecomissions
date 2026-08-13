import Link from "next/link";

const footerLinks = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/reviews", label: "Reviews" },
  { href: "/support", label: "Support" },
  { href: "/nsfw", label: "18+ NSFW" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-brand-dark">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <Link href="/" className="inline-block text-xl font-bold tracking-tight text-white font-display group">
              PANNE
              <span className="text-brand-purple-400 group-hover:text-brand-purple-300 transition-colors duration-300">
                {" "}Commissions
              </span>
            </Link>
            <p className="mt-2 text-xs text-gray-600">
              VRChat avatar commissions. Custom work for your avatar.
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 md:gap-8">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-500 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Panne Commissions. All rights reserved.
          </p>
          <Link
            href="/commission"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-brand-purple-500 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-purple-400 hover:shadow-[0_0_20px_rgba(147,51,234,0.25)]"
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
