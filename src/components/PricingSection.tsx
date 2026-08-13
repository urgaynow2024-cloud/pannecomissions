import ScrollReveal from "./ScrollReveal";

interface PricingItem {
  id: string;
  name: string;
  min_price: number | null;
  max_price: number | null;
  description: string | null;
}

interface PricingSectionProps {
  pricing: PricingItem[];
}

const DEFAULT_PRICING: PricingItem[] = [
  { id: "textures", name: "Textures", min_price: 5, max_price: 25, description: "depending on complexity." },
  { id: "entire-avatar", name: "Entire Avatars", min_price: 55, max_price: 100, description: "depending on complexity." },
  { id: "models", name: "Models", min_price: 65, max_price: 150, description: "depending on complexity." },
];

export default function PricingSection({ pricing }: PricingSectionProps) {
  const displayItems = pricing.length > 0 ? pricing : DEFAULT_PRICING;

  return (
    <section className="py-24 md:py-40 relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 md:mb-24">
          <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-[0.2em] mb-4">
            Rates
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display">
            Pricing
          </h2>
        </div>

        <ScrollReveal>
          <div className="max-w-3xl">
            {displayItems.map((item, i) => (
              <div
                key={item.id}
                className="group relative flex flex-col md:flex-row md:items-baseline justify-between py-8 md:py-10 border-b border-white/5 last:border-b-0 hover:border-brand-purple-500/20 transition-colors duration-500"
              >
                <div className="flex-1 pr-8">
                  <p className="text-lg md:text-xl font-medium text-white font-display tracking-tight">
                    {item.name}
                  </p>
                </div>
                <div className="mt-2 md:mt-0 md:text-right">
                  <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-display tracking-tight">
                    {item.min_price !== null && item.max_price !== null
                      ? `$${item.min_price}–$${item.max_price}`
                      : "Custom"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                    {item.description || "depending on complexity."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="mt-16 md:mt-24 max-w-3xl space-y-8">
            <p className="text-sm text-gray-400 leading-relaxed">
              These prices do <strong className="text-white font-medium">not</strong> include the cost of assets I may need to purchase. Those costs, per terms, will be added to the total before work begins.
            </p>

            <div className="space-y-6 pt-8 border-t border-white/5">
              <div>
                <p className="text-xs font-semibold text-brand-purple-400 uppercase tracking-[0.15em] mb-2">Payment</p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Cash App is preferred. PayPal is also available. Payment details are agreed upon before work starts.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-purple-400 uppercase tracking-[0.15em] mb-2">Trades</p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Art trades may be considered on a case-by-case basis. Other trades may also be considered, including FBT equipment or other useful VRChat-related items.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
