"use client";

import { useState } from "react";

interface CommissionFormProps {
  nsfw?: boolean;
}

export default function CommissionForm({ nsfw = false }: CommissionFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = "/api/commissions";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, nsfw }),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", service: "", description: "" });
      }
    } catch {
      // handle error silently
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
          <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-medium text-white">Commission enquiry submitted!</p>
        <p className="mt-2 text-sm text-gray-400">I&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      <div>
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
        <label className="mb-2 block text-sm font-medium text-gray-300">Description</label>
        <textarea
          required
          rows={5}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none transition-all focus:border-purple-500/50 focus:bg-white/[0.07] resize-none"
          placeholder="Tell me about your commission..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
