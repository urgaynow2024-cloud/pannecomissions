import ScrollReveal from "./ScrollReveal";

const steps = [
  {
    number: "01",
    title: "Tell Me What You Want",
    description: "Send me a commission enquiry with details about what you need.",
  },
  {
    number: "02",
    title: "We Figure It Out",
    description: "I review your request and get back to you to clarify anything.",
  },
  {
    number: "03",
    title: "Work Begins",
    description: "We sort out pricing and payment, then I start on your commission.",
  },
  {
    number: "04",
    title: "You Get Your Avatar",
    description: "You get the finished work and we sort out delivery.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-32 relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 md:mb-20">
          <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-3">
            The Process
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display">
            How It Works
          </h2>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {steps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 100}>
                <div
                key={step.number}
                className="group relative text-center lg:text-left"
              >
                <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-full border border-white/10 bg-white/[0.02] mb-6 mx-auto lg:mx-0 group-hover:border-brand-purple-500/30 group-hover:bg-brand-purple-500/5 transition-all duration-300">
                  <span className="text-sm font-bold text-brand-purple-400 font-display">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-semibold text-white mb-2 group-hover:text-brand-purple-300 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto lg:mx-0">
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
