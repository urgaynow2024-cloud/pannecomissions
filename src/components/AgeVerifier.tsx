"use client";

import { useState, useEffect } from "react";

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

  if (loading) {
    return null;
  }

  if (verified) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
      <div className="mx-auto max-w-md w-full px-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Age Verification</h2>
          <p className="text-gray-400 mb-8">
            This section contains adult content. You must be <strong className="text-white">18 years or older</strong> to continue.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleConfirm}
              className="w-full rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-purple-500"
            >
              I am 18 or older
            </button>
            <a
              href="/"
              className="w-full rounded-lg border border-white/10 px-6 py-3 font-semibold text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              Go Back
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
