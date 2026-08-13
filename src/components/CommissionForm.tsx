"use client";

import { useState } from "react";

interface Service {
  id: string;
  name: string;
}

interface CommissionFormProps {
  services: Service[];
}

type FormData = {
  name: string;
  email: string;
  service: string;
  description: string;
  additional: string;
};

type StepErrors = Partial<Record<keyof FormData, string>>;

const STEPS = [
  { label: "Hey!", hint: "What should I call you?" },
  { label: "What Are We Making?", hint: "Pick the service that matches what you need." },
  { label: "Tell Me About It", hint: "Describe what you need in as much detail as possible." },
  { label: "Anything Else?", hint: "Optional. Reference images, deadlines, or other notes." },
  { label: "How Should Panne Contact You?", hint: "Your email so I can reply." },
  { label: "Review", hint: "Double-check everything looks right." },
] as const;

const initialFormData: FormData = {
  name: "",
  email: "",
  service: "",
  description: "",
  additional: "",
};

export default function CommissionForm({ services }: CommissionFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});

  const validateStep = (step: number): boolean => {
    const errors: StepErrors = {};
    if (step === 0) {
      if (!formData.name.trim()) errors.name = "Please enter your name.";
      if (!formData.email.trim()) errors.email = "Please enter your email.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Please enter a valid email.";
    }
    if (step === 1) {
      if (!formData.service) errors.service = "Please select a service.";
    }
    if (step === 2) {
      if (!formData.description.trim()) errors.description = "Please describe what you need.";
    }
    if (step === 4) {
      if (!formData.email.trim()) errors.email = "Please enter your email.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Please enter a valid email.";
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
      setError(null);
    }
  };

  const prevStep = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
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
        setFormData(initialFormData);
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
        <div className="rounded-2xl border border-brand-purple-500/30 bg-brand-purple-500/5 p-8 md:p-12 text-center overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-purple-500/5 via-transparent to-transparent" />
          <div className="relative">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-brand-purple-500/20 bg-brand-purple-500/10 animate-fade-in-scale">
              <span className="text-brand-purple-400 text-lg">✦</span>
            </div>
            <p className="text-2xl font-bold text-white mb-3 font-display animate-fade-in-up">
              COMMISSION SENT
            </p>
            <p className="text-sm text-gray-400 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
              I&apos;ll review your request and reach out at the email you provided.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const serviceName = services.find((s) => s.id === formData.service)?.name;

  return (
    <div className="mx-auto max-w-2xl">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-center mb-8">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-8">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (i <= currentStep) setCurrentStep(i);
                }}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold font-display transition-all duration-300 ${
                  i <= currentStep
                    ? "bg-brand-purple-500 text-white shadow-lg shadow-brand-purple-500/20"
                    : "bg-white/5 text-gray-600 border border-white/10"
                } ${i > currentStep ? "cursor-default" : "cursor-pointer"}`}
              >
                {i < currentStep ? (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  String(i + 1).padStart(2, "0")
                )}
              </button>
              {i < STEPS.length - 1 && (
                <div className={`hidden sm:block h-px w-8 transition-colors duration-300 ${i < currentStep ? "bg-brand-purple-500" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="animate-fade-in-up" key={currentStep}>
          <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-1">
            Step {String(currentStep + 1).padStart(2, "0")}
          </p>
          <h3 className="text-xl md:text-2xl font-semibold text-white font-display mb-1">
            {STEPS[currentStep].label}
          </h3>
          <p className="text-sm text-gray-400">{STEPS[currentStep].hint}</p>
        </div>
      </div>

      {currentStep === 0 && (
        <div className="space-y-5 animate-fade-in" key="step-0">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              required
              className={`w-full rounded-xl border bg-white/5 px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(168,85,247,0.05)] ${stepErrors.name ? "border-red-500/50" : "border-white/10 focus:border-brand-purple-500/50"}`}
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (stepErrors.name) setStepErrors({ ...stepErrors, name: "" });
              }}
            />
            {stepErrors.name && <p className="text-xs text-red-400 mt-1.5">{stepErrors.name}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              required
              className={`w-full rounded-xl border bg-white/5 px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(168,85,247,0.05)] ${stepErrors.email ? "border-red-500/50" : "border-white/10 focus:border-brand-purple-500/50"}`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (stepErrors.email) setStepErrors({ ...stepErrors, email: "" });
              }}
            />
            {stepErrors.email && <p className="text-xs text-red-400 mt-1.5">{stepErrors.email}</p>}
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div className="animate-fade-in" key="step-1">
          <label className="mb-3 block text-sm font-medium text-gray-300">Service</label>
          <div className="grid grid-cols-1 gap-3">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => {
                  setFormData({ ...formData, service: service.id });
                  if (stepErrors.service) setStepErrors({ ...stepErrors, service: "" });
                }}
                className={`text-left rounded-xl border px-5 py-4 transition-all duration-300 ${
                  formData.service === service.id
                    ? "border-brand-purple-500/50 bg-brand-purple-500/10 shadow-[0_0_20px_rgba(147,51,234,0.1)]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <p className="text-sm font-medium text-white font-display">{service.name}</p>
              </button>
            ))}
          </div>
          {stepErrors.service && <p className="text-xs text-red-400 mt-3">{stepErrors.service}</p>}
        </div>
      )}

      {currentStep === 2 && (
        <div className="animate-fade-in" key="step-2">
          <label className="mb-2 block text-sm font-medium text-gray-300">Description</label>
          <textarea
            required
            rows={6}
            className={`w-full rounded-xl border bg-white/5 px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(168,85,247,0.05)] resize-none ${stepErrors.description ? "border-red-500/50" : "border-white/10 focus:border-brand-purple-500/50"}`}
            placeholder="Describe what you need..."
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              if (stepErrors.description) setStepErrors({ ...stepErrors, description: "" });
            }}
          />
          {stepErrors.description && <p className="text-xs text-red-400 mt-1.5">{stepErrors.description}</p>}
        </div>
      )}

      {currentStep === 3 && (
        <div className="animate-fade-in" key="step-3">
          <label className="mb-2 block text-sm font-medium text-gray-300">Additional Information</label>
          <textarea
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-brand-purple-500/50 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(168,85,247,0.05)] resize-none"
            placeholder="Optional additional information..."
            value={formData.additional}
            onChange={(e) => setFormData({ ...formData, additional: e.target.value })}
          />
        </div>
      )}

      {currentStep === 4 && (
        <div className="animate-fade-in" key="step-4">
          <label className="mb-2 block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            required
            className={`w-full rounded-xl border bg-white/5 px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(168,85,247,0.05)] ${stepErrors.email ? "border-red-500/50" : "border-white/10 focus:border-brand-purple-500/50"}`}
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (stepErrors.email) setStepErrors({ ...stepErrors, email: "" });
            }}
          />
          {stepErrors.email && <p className="text-xs text-red-400 mt-1.5">{stepErrors.email}</p>}
        </div>
      )}

      {currentStep === 5 && (
        <div className="animate-fade-in space-y-6" key="step-5">
          <div className="rounded-xl border border-brand-purple-500/20 bg-brand-purple-500/5 divide-y divide-white/5">
            {[
              { label: "Name", value: formData.name },
              { label: "Service", value: serviceName },
              { label: "Description", value: formData.description },
              { label: "Additional Info", value: formData.additional || "None" },
              { label: "Email", value: formData.email },
            ].map((field) => (
              <div key={field.label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 py-4 px-5">
                <p className="text-xs font-semibold text-brand-purple-300 uppercase tracking-widest w-32 shrink-0">
                  {field.label}
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">{field.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Make sure everything looks right before submitting.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mt-10">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="text-sm font-medium text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2"
        >
          ← Back
        </button>
        {currentStep < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={nextStep}
            className="group relative inline-flex items-center gap-2 rounded-full bg-brand-purple-500 px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-purple-400 hover:shadow-lg hover:shadow-brand-purple-500/20"
          >
            Next
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="group relative inline-flex items-center gap-2 rounded-full bg-brand-purple-500 px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-purple-400 hover:shadow-lg hover:shadow-brand-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : (
              <>
                Send Commission
                <span className="text-brand-purple-200">✦</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
