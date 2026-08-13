import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import SectionGlow from "./SectionGlow";
import SparkleField from "./SparkleField";

interface Service {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

interface ServicesProps {
  services: Service[];
}

const DEFAULT_SERVICES: Service[] = [
  { id: "clothing", name: "Clothing Add-ons", description: "Adding clothing pieces, accessories, and outfit options to existing avatars.", image_url: null },
  { id: "complete-avatars", name: "Entire Avatars", description: "Full avatar assemblies from premade assets, tailored to your needs.", image_url: null },
  { id: "toggles", name: "Toggles", description: "Avatar toggles and options for switching between different looks or states.", image_url: null },
  { id: "custom-textures", name: "Custom Textures", description: "Custom texture work for your avatar, from subtle tweaks to full repaints.", image_url: null },
  { id: "models", name: "Models", description: "3D modelling work for avatars, accessories, and custom parts.", image_url: null },
];

const ASPECTS = ["aspect-[4/5]", "aspect-square", "aspect-[3/4]", "aspect-[4/3]", "aspect-[5/4]"];

function ServiceImageFallback({ name, index }: { name: string; index: number }) {
  return (
    <div className={`relative w-full ${ASPECTS[index % ASPECTS.length]} rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02] group`}>
      <div className="absolute inset-0 bg-gradient-to-br from-brand-purple-500/15 via-brand-purple-500/6 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <span className="text-brand-purple-400/25 text-3xl animate-sparkle-float">✦</span>
        <p className="text-sm font-medium text-gray-500 text-center px-6 font-display tracking-wide">
          {name}
        </p>
      </div>
      <div className="absolute top-4 right-4">
        <span className="text-brand-purple-400/20 text-xl animate-sparkle-float" style={{ animationDelay: "-2s" }}>✧</span>
      </div>
      <div className="absolute bottom-4 left-4">
        <span className="text-brand-purple-400/15 text-lg animate-sparkle-float" style={{ animationDelay: "-4s" }}>✦</span>
      </div>
    </div>
  );
}

export default function Services({ services }: ServicesProps) {
  const displayServices = services.length > 0 ? services : DEFAULT_SERVICES;

  return (
    <section className="py-24 md:py-40 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[700px] h-[600px] bg-brand-purple-500/10 rounded-full blur-[160px]" style={{ animation: "pulseGlow 8s ease-in-out infinite" }} />
        <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[500px] bg-brand-purple-600/8 rounded-full blur-[140px]" style={{ animation: "pulseGlow 8s ease-in-out infinite 4s" }} />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-brand-purple-500/5 rounded-full blur-[200px]" />
      </div>
      <SectionGlow intensity="subtle" />
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <ScrollReveal>
          <div className="mb-20 md:mb-28 relative">
            <SparkleField count={4} minSize={3} maxSize={8} minOpacity={0.2} maxOpacity={0.5} className="-inset-4" glow />
            <div className="relative z-10">
              <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-[0.2em] mb-4">
                What I Do
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display">
                Services <span className="text-brand-purple-400">✦</span>
              </h2>
            </div>
          </div>
        </ScrollReveal>

        <div className="space-y-24 md:space-y-40">
          {displayServices.map((service, i) => {
            const isEven = i % 2 === 0;
            return (
              <ScrollReveal key={service.id} delay={i * 100}>
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center ${!isEven ? "lg:[&>:first-child]:order-2 lg:[&>:last-child]:order-1" : ""}`}>
                  <div className={`lg:col-span-5 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                    <div className={`relative ${ASPECTS[i % ASPECTS.length]} rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02] transition-all duration-500 hover:border-brand-purple-500/30 hover:shadow-[0_0_50px_rgba(168,85,247,0.1)] artwork-glow`}>
                      {service.image_url ? (
                        <>
                          <img
                            src={service.image_url}
                            alt={service.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                          <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-500/10 to-transparent" />
                        </>
                      ) : (
                        <ServiceImageFallback name={service.name} index={i} />
                      )}
                    </div>
                  </div>
                  <div className={`lg:col-span-7 ${isEven ? "lg:order-2" : "lg:order-1"} ${!isEven ? "lg:text-right" : ""}`}>
                    <p className="text-7xl md:text-8xl lg:text-[9rem] font-bold text-white/[0.03] font-display leading-none select-none mb-2">
                      0{i + 1}
                    </p>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-display tracking-tight">
                      {service.name}
                    </h3>
                    <p className="text-gray-400 leading-relaxed max-w-lg text-base md:text-lg mt-4">
                      {service.description || ""}
                    </p>
                    <Link
                      href="/commission"
                      className={`group inline-flex items-center gap-3 text-sm font-medium text-brand-purple-400 hover:text-brand-purple-300 transition-colors mt-6 ${!isEven ? "lg:flex-row-reverse" : ""}`}
                    >
                      Ask about this
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
