const steps = [
  {
    number: "1",
    title: "Tell me what you want",
    description: "Send me a commission enquiry with details about what you need.",
  },
  {
    number: "2",
    title: "We discuss the project",
    description: "I&apos;ll review your request and get back to you to clarify anything.",
  },
  {
    number: "3",
    title: "Payment or trade is agreed",
    description: "We sort out the details, pricing, and payment method.",
  },
  {
    number: "4",
    title: "Work begins",
    description: "I start work on your commission and keep you updated.",
  },
  {
    number: "5",
    title: "You receive the finished work",
    description: "You get the finished avatar and we sort out delivery.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
            How It Works
          </h2>
          <p className="text-gray-400">
            From enquiry to finished work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="text-4xl font-bold text-purple-500/20 mb-4">{step.number}</div>
              <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
