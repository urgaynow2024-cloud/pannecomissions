import ScrollReveal from "./ScrollReveal";
import Sparkle from "./Sparkle";

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
        <ScrollReveal>
          <div className="mb-16 md:mb-24 text-center">
            <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-[0.2em] mb-4">
              The Process
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display">
              How It Works
            </h2>
          </div>
        </ScrollReveal>

        <div className="relative max-w-4xl mx-auto">
          <div className="hidden lg:block absolute left-[28px] top-[28px] bottom-[28px] w-px bg-gradient-to-b from-brand-purple-500/30 via-brand-purple-500/15 to-brand-purple-500/30" />

          <div className="space-y-12 md:space-y-16">
            {steps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 100}>
                <div className="group flex items-start gap-6 md:gap-10">
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center group-hover:border-brand-purple-500/40 group-hover:bg-brand-purple-500/5 transition-all duration-500 relative z-10">
                      <span className="text-sm font-bold text-brand-purple-400 font-display">
                        {step.number}
                      </span>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center">
                      <Sparkle className="w-2.5 h-2.5 text-brand-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                  <div className="flex-1 pt-3">
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-2 group-hover:text-brand-purple-300 transition-colors duration-300 font-display">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
