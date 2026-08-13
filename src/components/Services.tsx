import Link from "next/link";

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

export default function Services({ services }: ServicesProps) {
  const displayServices = services.length > 0 ? services : DEFAULT_SERVICES;

  return (
    <section className="py-24 md:py-40 relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 md:mb-28">
          <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-[0.2em] mb-4">
            What I Do
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display">
            Services
          </h2>
        </div>

        <div className="space-y-24 md:space-y-40">
          {displayServices.map((service, i) => {
            const isEven = i % 2 === 0;
            const compositions = [
              "aspect-[4/5]",
              "aspect-square",
              "aspect-[3/4]",
              "aspect-[4/3]",
              "aspect-[5/4]",
            ];
            return (
              <div
                key={service.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center ${isEven ? "" : "lg:[&>:first-child]:order-2 lg:[&>:last-child]:order-1"}`}
              >
                <div className={`lg:col-span-5 ${isEven ? "lg:order-1" : "lg:order-2"} ${isEven ? "" : "lg:text-right"}`}>
                  <div className={`relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] ${compositions[i % compositions.length]}`}>
                    {service.image_url ? (
                      <>
                        <img
                          src={service.image_url}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.04]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-sm text-gray-600">Image coming soon</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`lg:col-span-7 ${isEven ? "lg:order-2" : "lg:order-1"} space-y-5`}>
                  <p className="text-6xl md:text-7xl lg:text-8xl font-bold text-white/[0.04] font-display leading-none select-none">
                    0{i + 1}
                  </p>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-display tracking-tight">
                    {service.name}
                  </h3>
                  <p className="text-gray-400 leading-relaxed max-w-lg text-base md:text-lg">
                    {service.description || ""}
                  </p>
                  <Link
                    href="/commission"
                    className="group inline-flex items-center gap-3 text-sm font-medium text-brand-purple-400 hover:text-brand-purple-300 transition-colors mt-2"
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
