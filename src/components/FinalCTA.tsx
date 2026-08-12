"use client";

import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-20 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Ready to commission?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Send me a commission enquiry and I&apos;ll get back to you.
          </p>
          <Link
            href="/commission"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition-colors"
          >
            Start a Commission
          </Link>
        </div>
      </div>
    </section>
  );
}
