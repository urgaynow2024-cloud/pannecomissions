"use client";

import { useState } from "react";

interface Service {
  id: string;
  name: string;
}

interface CommissionFormProps {
  services: Service[];
}

export default function CommissionForm({ services }: CommissionFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    description: "",
    additional: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/commissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", service: "", description: "", additional: "" });
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
          <p className="text-lg font-medium text-white mb-2 font-display">Commission enquiry sent!</p>
          <p className="text-sm text-gray-400">
            I&apos;ll review your request and contact you at the email address you provided.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-10">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-center">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div>
        <div className="mb-6">
          <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-1">
            Step 01
          </p>
          <h3 className="text-xl font-semibold text-white font-display">About You</h3>
          <p className="text-sm text-gray-400 mt-1">Basic details so I can get in touch.</p>
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
            Step 02
          </p>
          <h3 className="text-xl font-semibold text-white font-display">What Do You Want?</h3>
          <p className="text-sm text-gray-400 mt-1">Pick the service that matches what you need.</p>
        </div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Service</label>
        <select
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition-all duration-200 focus:border-brand-purple-500/50 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(168,85,247,0.05)] appearance-none"
          value={formData.service}
          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>{service.name}</option>
          ))}
        </select>
      </div>

      <div>
        <div className="mb-6">
          <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-1">
            Step 03
          </p>
          <h3 className="text-xl font-semibold text-white font-display">Tell Me About It</h3>
          <p className="text-sm text-gray-400 mt-1">Describe what you need in as much detail as possible.</p>
        </div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Description</label>
        <textarea
          required
          rows={6}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-brand-purple-500/50 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(168,85,247,0.05)] resize-none"
          placeholder="Describe your commission..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <div className="mb-6">
          <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-1">
            Step 04
          </p>
          <h3 className="text-xl font-semibold text-white font-display">Anything Else?</h3>
          <p className="text-sm text-gray-400 mt-1">Optional. Reference images, deadlines, or other notes.</p>
        </div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Additional Information</label>
        <textarea
          rows={4}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-brand-purple-500/50 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(168,85,247,0.05)] resize-none"
          placeholder="Optional additional information..."
          value={formData.additional}
          onChange={(e) => setFormData({ ...formData, additional: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="group relative w-full rounded-full bg-brand-purple-500 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-purple-400 hover:shadow-xl hover:shadow-brand-purple-500/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? "Submitting..." : "Submit Commission Enquiry"}
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
