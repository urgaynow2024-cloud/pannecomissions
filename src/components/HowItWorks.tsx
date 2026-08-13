import ScrollReveal from "./ScrollReveal";

const steps = [
  {
    number: "01",
    title: "Tell Me What You Want",
    description: "Send me a commission enquiry with details about what you need.",
  },
  {
    number: "02",
    title: "We Figure Out Details",
    description: "I review your request and get back to you to clarify anything.",
  },
  {
    number: "03",
    title: "Payment or Trade",
    description: "We sort out pricing and payment, then I start on your commission.",
  },
  {
    number: "04",
    title: "Work Begins",
    description: "I start building your commission and keep you updated along the way.",
  },
  {
    number: "05",
    title: "Your Avatar Is Ready",
    description: "You get the finished work and we sort out delivery.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 md:py-40 relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 md:mb-24">
          <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-[0.2em] mb-4">
            The Process
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display">
            How It Works
          </h2>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-[28px] left-[28px] right-[28px] h-px bg-gradient-to-r from-brand-purple-500/40 via-brand-purple-500/20 to-brand-purple-500/40" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-8">
            {steps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 120}>
                <div className="group relative flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="relative mb-8">
                    <div className="w-14 h-14 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center group-hover:border-brand-purple-500/40 group-hover:bg-brand-purple-500/5 transition-all duration-500">
                      <span className="text-sm font-bold text-brand-purple-400 font-display">
                        {step.number}
                      </span>
                    </div>
                    <svg
                      className="absolute -top-1 -right-1 w-2 h-2 text-brand-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                    </svg>
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-white mb-2 group-hover:text-brand-purple-300 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-[220px]">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
