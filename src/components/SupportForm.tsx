"use client";

import { useState } from "react";

export default function SupportForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-brand-purple-500/30 bg-brand-purple-500/5 p-8 md:p-10 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-purple-500/10">
            <svg className="h-6 w-6 text-brand-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-medium text-white font-display mb-2">Support request submitted!</p>
          <p className="text-sm text-gray-400">I&apos;ll get back to you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-center">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      <div>
        <div className="mb-6">
          <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-1">
            Contact
          </p>
          <h3 className="text-xl font-semibold text-white font-display">Your Details</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-brand-purple-500/50 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(168,85,247,0.05)]"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-brand-purple-500/50 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(168,85,247,0.05)]"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="mb-6">
          <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-1">
            What&apos;s Up?
          </p>
          <h3 className="text-xl font-semibold text-white font-display">Your Message</h3>
        </div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Describe your issue</label>
        <textarea
          required
          rows={6}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-brand-purple-500/50 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(168,85,247,0.05)] resize-none"
          placeholder="Describe your issue..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="group relative w-full rounded-full bg-brand-purple-500 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-purple-400 hover:shadow-xl hover:shadow-brand-purple-500/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? "Submitting..." : "Submit Support Request"}
          {!loading && (
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          )}
        </span>
      </button>
    </form>
  );
}
