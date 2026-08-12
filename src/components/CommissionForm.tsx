"use client";

import { useState } from "react";

export default function CommissionForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    description: "",
    additional: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/commissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", service: "", description: "", additional: "" });
      }
    } catch {
      // handle error silently
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
            <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-medium text-white mb-2">Commission enquiry sent!</p>
          <p className="text-sm text-gray-400">
            I&apos;ll review your request and contact you at the email address you provided.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">About You</h3>
        <p className="text-sm text-gray-400 mb-4">Basic details so I can get in touch.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none transition-all focus:border-purple-500/50 focus:bg-white/[0.07]"
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
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none transition-all focus:border-purple-500/50 focus:bg-white/[0.07]"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-1">What do you want?</h3>
        <p className="text-sm text-gray-400 mb-4">Pick the service that matches what you need.</p>
        <label className="mb-2 block text-sm font-medium text-gray-300">Service</label>
        <select
          required
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-purple-500/50 focus:bg-white/[0.07]"
          value={formData.service}
          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
        >
          <option value="">Select a service</option>
          <option value="textures">Custom Textures</option>
          <option value="entire-avatar">Entire Avatar</option>
          <option value="models">Models</option>
          <option value="clothing">Clothing Add-ons</option>
          <option value="toggles">Toggles & Options</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-1">Tell me about it</h3>
        <p className="text-sm text-gray-400 mb-4">Describe what you need in as much detail as possible.</p>
        <label className="mb-2 block text-sm font-medium text-gray-300">Description</label>
        <textarea
          required
          rows={6}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none transition-all focus:border-purple-500/50 focus:bg-white/[0.07] resize-none"
          placeholder="Describe your commission..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-1">Anything else?</h3>
        <p className="text-sm text-gray-400 mb-4">Optional. Reference images, deadlines, or other notes.</p>
        <label className="mb-2 block text-sm font-medium text-gray-300">Additional Information</label>
        <textarea
          rows={4}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none transition-all focus:border-purple-500/50 focus:bg-white/[0.07] resize-none"
          placeholder="Optional additional information..."
          value={formData.additional}
          onChange={(e) => setFormData({ ...formData, additional: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-purple-600 px-6 py-3.5 font-semibold text-white transition-all duration-200 hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting..." : "Submit Commission Enquiry"}
      </button>
    </form>
  );
}
