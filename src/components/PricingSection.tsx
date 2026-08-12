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
    <section className="py-20 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">Pricing</h2>
          <p className="text-gray-400">Starting ranges. Final price depends on the work involved.</p>
        </div>

        {displayItems.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No pricing information available.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              {displayItems.map((item) => (
                <div key={item.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                  <p className="text-sm font-medium text-purple-400 mb-1">{item.name}</p>
                  <p className="text-3xl font-bold text-white mb-1">
                    {item.min_price !== null && item.max_price !== null ? `$${item.min_price}–$${item.max_price}` : "Custom"}
                  </p>
                  <p className="text-sm text-gray-400">{item.description || "depending on complexity."}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 md:p-8 max-w-3xl">
              <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
                <p>
                  Please note that these prices do <strong className="text-white">NOT</strong> include the prices of the assets I have to buy. Those, per terms, will have to be added onto the total. Like everyone does.
                </p>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-white font-medium mb-2">Payment</p>
                  <p className="mb-3">Cash App is preferred. PayPal is also available. Payment details are agreed before work starts.</p>
                  <p className="text-white font-medium mb-2">Trades</p>
                  <p>
                    Art trades may be considered on a case-by-case basis. Other trades may also be considered, including FBT equipment or other useful VRChat-related items. Trades are not guaranteed to be accepted.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
