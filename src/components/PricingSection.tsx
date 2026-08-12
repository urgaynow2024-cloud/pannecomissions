export default function Pricing() {
  return (
    <section className="py-20 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
            Pricing
          </h2>
          <p className="text-gray-400">
            Starting ranges. Final price depends on the work involved.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <p className="text-sm font-medium text-purple-400 mb-1">Textures</p>
            <p className="text-3xl font-bold text-white">$5–25</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <p className="text-sm font-medium text-purple-400 mb-1">Entire Avatars</p>
            <p className="text-3xl font-bold text-white">$55–100</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <p className="text-sm font-medium text-purple-400 mb-1">Models</p>
            <p className="text-3xl font-bold text-white">$65–150</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 md:p-8 max-w-3xl">
          <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
          <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
            <p>
              Prices depend on complexity. A more complicated project may cost more depending on the amount of work involved.
            </p>
            <p>
              Paid assets required for a commission are <strong className="text-white">not included</strong> in the commission price. If an avatar needs an asset that has to be purchased, the cost is added separately.
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
      </div>
    </section>
  );
}
