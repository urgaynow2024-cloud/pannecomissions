"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AgeVerifier() {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("nsfw-verified");
    if (stored === "true") {
      setVerified(true);
    }
    setLoading(false);
  }, []);

  const handleConfirm = () => {
    sessionStorage.setItem("nsfw-verified", "true");
    setVerified(true);
  };

  if (loading) return null;
  if (verified) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl">
      <div className="mx-auto max-w-md w-full px-6 animate-fade-in-up">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-red-500/20 bg-red-500/5">
            <svg className="h-7 w-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white font-display mb-3">
            Age Verification
          </h2>
          <p className="text-gray-400 mb-8 text-[15px]">
            This section contains adult content. You must be <strong className="text-white">18 years or older</strong> to continue.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleConfirm}
              className="w-full rounded-full bg-brand-purple-500 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-purple-400 hover:shadow-lg hover:shadow-brand-purple-500/25"
            >
              I am 18 or older
            </button>
            <Link
              href="/"
              className="w-full rounded-full border border-white/10 px-6 py-3.5 text-sm font-semibold text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white"
            >
              Go Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
