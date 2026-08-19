import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NoiseOverlay from "@/components/NoiseOverlay";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const revalidate = 30;

async function getData() {
  try {
    const services = await prisma.Service.findMany({
      where: { visible: true },
      orderBy: { sort_order: "asc" },
    });

    return services.map((service: { id: string; name: string; description: string | null; image_url: string | null }) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      image_url: service.image_url,
    }));
  } catch {
    return [];
  }
}

const SERVICE_PRICES: Record<string, { range: string; description: string }> = {
  "Textures": {
    range: "$5–$25",
    description: "Recolours, custom textures, decals, patterns, edits, and similar work. Final price depends on complexity and amount of work required.",
  },
  "Entire Avatars": {
    range: "$55–$100",
    description: "Complete avatar assemblies from premade assets, tailored to your needs. Final price depends on the avatar, requested changes, complexity, and amount of work required.",
  },
  "Models": {
    range: "$65–$150",
    description: "Custom or modified 3D model work. Final price depends on the modelling requirements, complexity, and amount of work required.",
  },
};

export default async function ServicesPage() {
  const services = await getData();

  return (
    <main className="min-h-screen bg-brand-black text-white antialiased relative">
      <NoiseOverlay />
      <Navbar />
      <div className="pt-32 md:pt-40 pb-20 md:pb-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 md:mb-16">
            <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-3">
              Pricing Guide
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display heading-pop">
              Services & Pricing
            </h1>
            <p className="text-lg text-gray-400 mt-4 max-w-2xl">
              Starting prices for common commission types. Final cost depends on complexity and scope.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {services.map((service: { id: string; name: string; description: string | null; image_url: string | null }) => {
              const priceInfo = SERVICE_PRICES[service.name] || { range: "TBD", description: service.description || "" };
              return (
                <div
                  key={service.id}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 md:p-8 hover:border-white/10 transition-colors"
                >
                  <h3 className="text-xl font-bold text-white font-display mb-2">{service.name}</h3>
                  <p className="text-3xl font-bold text-brand-purple-400 mb-4">{priceInfo.range}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{priceInfo.description}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 md:p-8 mb-16">
            <div className="flex items-center gap-3 mb-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white font-display">Commissions are currently open</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              These prices do not include the cost of assets I may need to purchase. Any required asset costs will be discussed with the customer and added to the total before work begins.
            </p>
          </div>

          <div className="space-y-12 md:space-y-16">
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-display heading-pop mb-4">Before You Commission</h2>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex gap-3">
                  <span className="text-brand-purple-400 mt-0.5">•</span>
                  <span>Customers must have the right/permission to use assets they provide.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-purple-400 mt-0.5">•</span>
                  <span>Stolen, leaked, ripped, or otherwise unauthorized assets will not be accepted.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-purple-400 mt-0.5">•</span>
                  <span>Customers are responsible for providing usable files/assets.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-purple-400 mt-0.5">•</span>
                  <span>Requirements should be discussed before work begins.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-purple-400 mt-0.5">•</span>
                  <span>Extra work outside the original agreement may cost extra.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-purple-400 mt-0.5">•</span>
                  <span>Required purchased assets will be discussed and approved before they are added to the total.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-purple-400 mt-0.5">•</span>
                  <span>Panne may refuse work involving assets that violate their creator&apos;s terms.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-display heading-pop mb-4">Payment</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Cash App is preferred. PayPal is also available. Payment details and the total price are agreed upon with the customer before work begins. The final payment arrangement is agreed upon beforehand.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-display heading-pop mb-4">Trades</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Art trades may be considered on a case-by-case basis. Other trades may also be considered, including FBT equipment or other useful VRChat-related items. Trades are not guaranteed and must be agreed upon before any work begins.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-display heading-pop mb-4">Payment, Cancellations & Refunds</h2>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex gap-3">
                  <span className="text-brand-purple-400 mt-0.5">•</span>
                  <span>Payment arrangements are agreed upon before work begins.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-purple-400 mt-0.5">•</span>
                  <span>Cancelling a commission may affect whether a refund is available depending on how much work has already been completed.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-purple-400 mt-0.5">•</span>
                  <span>Extra requests or changes outside the original agreement may increase the price.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-purple-400 mt-0.5">•</span>
                  <span>If Panne cannot complete a commission, the situation will be discussed with the customer and handled appropriately.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-purple-400 mt-0.5">•</span>
                  <span>Customers should contact Panne first if there is an issue with a payment or commission.</span>
                </li>
              </ul>
              <div className="mt-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
                <p className="text-sm text-gray-300 leading-relaxed">
                  If there is an issue with a commission or payment, please contact Panne first so the issue can be resolved. Attempting to reverse a legitimate payment through a chargeback or payment dispute without first contacting Panne may result in the commission being cancelled and the customer being refused future commissions.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-display heading-pop mb-4">Commission Blacklist</h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Panne may refuse future commissions for serious or repeated issues, including:
              </p>
              <ul className="space-y-3 text-sm text-gray-400 mb-6">
                <li className="flex gap-3">
                  <span className="text-brand-purple-400 mt-0.5">•</span>
                  <span>Fraudulent chargebacks or payment disputes</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-purple-400 mt-0.5">•</span>
                  <span>Repeated attempts to obtain unpaid work</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-purple-400 mt-0.5">•</span>
                  <span>Providing stolen, leaked, ripped, or unauthorized assets</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-purple-400 mt-0.5">•</span>
                  <span>Harassment or abusive behaviour</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-purple-400 mt-0.5">•</span>
                  <span>Repeatedly violating commission terms</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-purple-400 mt-0.5">•</span>
                  <span>Other serious abuse of the commission service</span>
                </li>
              </ul>
              <p className="text-sm text-gray-400 leading-relaxed">
                Being blacklisted means Panne may refuse future commission requests.
              </p>
              <p className="text-sm text-gray-500 mt-3">
                Blacklisting does not remove any rights a customer has under applicable consumer law.
              </p>
            </section>

            <div className="text-center pt-8">
              <Link
                href="/commission"
                className="inline-flex items-center gap-2 rounded-full bg-brand-purple-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-brand-purple-500 transition-colors btn-glow"
              >
                Ready to Commission?
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
