const services = [
  {
    title: "Clothing Add-ons",
    description: "Adding clothing and accessories to existing VRChat avatars.",
  },
  {
    title: "Complete Avatars",
    description: "Putting together complete avatars using premade assets.",
  },
  {
    title: "Toggles",
    description: "Adding outfit, clothing, accessory and other avatar toggles.",
  },
  {
    title: "Custom Textures",
    description: "Creating custom textures depending on the complexity of the request.",
  },
  {
    title: "Models",
    description: "More advanced modelling work depending on the project.",
  },
];

export default function Services() {
  return (
    <section className="py-20 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
            Services
          </h2>
          <p className="text-gray-400">
            What I can do for your VRChat avatar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:border-purple-500/30"
            >
              <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
