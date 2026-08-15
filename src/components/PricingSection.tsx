import ScrollReveal from "./ScrollReveal";
import SectionGlow from "./SectionGlow";
import SparkleField from "./SparkleField";

interface PricingItem {
  id: string;
  name: string;
  min_price: number | null;
  max_price: number | null;
  description: string | null;
}

interface PricingSectionProps {
  pricing: PricingItem[];
  commissionAvailable?: boolean;
  commissionStatusText?: string;
}

const DEFAULT_PRICING: PricingItem[] = [
  { id: "textures", name: "Textures", min_price: 5, max_price: 25, description: "depending on complexity" },
  { id: "entire-avatar", name: "Entire Avatars", min_price: 55, max_price: 100, description: "depending on complexity" },
  { id: "models", name: "Models", min_price: 65, max_price: 150, description: "depending on complexity" },
];

export default function PricingSection({ pricing, commissionAvailable, commissionStatusText }: PricingSectionProps) {
  const displayItems = pricing.length > 0 ? pricing : DEFAULT_PRICING;

  return (
    <section className="py-24 md:py-40 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[700px] h-[500px] bg-brand-purple-500/8 rounded-full blur-[160px]" style={{ animation: "pulseGlow 7s ease-in-out infinite" }} />
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[400px] bg-brand-purple-600/6 rounded-full blur-[140px]" style={{ animation: "pulseGlow 7s ease-in-out infinite 3s" }} />
      </div>
      <SectionGlow intensity="subtle" />
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <ScrollReveal>
          <div className="mb-16 md:mb-24 relative">
            <SparkleField count={6} minSize={4} maxSize={14} minOpacity={0.2} maxOpacity={0.5} className="-inset-6" glow />
            <div className="relative z-10">
              <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-[0.2em] mb-4">
                Rates
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display heading-pop">
                Pricing <span className="text-brand-purple-400">✦</span>
              </h2>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="max-w-3xl">
            {displayItems.map((item, i) => (
              <div
                key={item.id}
                className="group relative flex flex-col md:flex-row md:items-baseline justify-between py-8 md:py-10 border-b border-white/5 last:border-b-0 hover:border-brand-purple-500/30 transition-all duration-500 hover:bg-brand-purple-500/[0.04] px-2 -mx-2 rounded-lg"
              >
                <div className="flex-1 pr-8">
                  <p className="text-lg md:text-xl font-medium text-white font-display tracking-tight group-hover:text-brand-purple-300 transition-colors">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {item.description || "depending on complexity"}
                  </p>
                </div>
                <div className="mt-3 md:mt-0 md:text-right flex-shrink-0">
                  <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-display tracking-tight group-hover:text-brand-purple-300 transition-colors">
                    {item.min_price !== null && item.max_price !== null
                      ? `$${item.min_price}–$${item.max_price}`
                      : "Custom"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="mt-16 md:mt-24 max-w-3xl space-y-8">
            {commissionAvailable !== undefined && (
              <div className={`rounded-xl border p-4 ${commissionAvailable ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"}`}>
                <p className={`text-sm font-medium ${commissionAvailable ? "text-green-300" : "text-red-300"}`}>
                  {commissionAvailable ? "Commissions are currently open" : "Commissions are currently closed"}
                  {commissionStatusText && <span className="text-gray-400"> — {commissionStatusText}</span>}
                </p>
              </div>
            )}

            <p className="text-sm text-gray-400 leading-relaxed">
              These prices do <strong className="text-white font-medium">not</strong> include the cost of assets I may need to purchase. Those costs, per terms, will be added to the total before work begins.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-white/5">
              <div>
                <p className="text-xs font-semibold text-brand-purple-400 uppercase tracking-[0.15em] mb-3">Payment</p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Cash App is preferred. PayPal is also available. Payment details are agreed upon before work starts.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-purple-400 uppercase tracking-[0.15em] mb-3">Trades</p>
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
