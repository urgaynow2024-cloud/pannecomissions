"use client";

import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-20 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Want to get started?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Send me a commission enquiry and I&apos;ll get back to you.
          </p>
          <Link
            href="/commission"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-purple-600 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/25"
          >
            <span className="relative z-10 flex items-center gap-2">
              Commission Me
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
