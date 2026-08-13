import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SparkleSystem from "@/components/SparkleSystem";
import NoiseOverlay from "@/components/NoiseOverlay";
import PricingSection from "@/components/PricingSection";
import prisma from "@/lib/prisma";

export const revalidate = 60;

async function getData() {
  try {
    const pricing = await prisma.Pricing.findMany({
      where: { visible: true },
      orderBy: { sort_order: "asc" },
    });

    return pricing
      .filter((p: { category: string }) => p.category === "sfw")
      .map((item: { id: string; name: string; min_price: number | null; max_price: number | null; description: string | null }) => ({
        id: item.id,
        name: item.name,
        min_price: item.min_price,
        max_price: item.max_price,
        description: item.description,
      }));
  } catch {
    return [];
  }
}

export default async function PricingPage() {
  const pricing = await getData();

  return (
    <main className="min-h-screen bg-brand-black text-white antialiased relative">
      <SparkleSystem />
      <NoiseOverlay />
      <Navbar />
      <div className="pt-32 md:pt-40 pb-20 md:pb-32">
        <div className="mx-auto max-w-7xl px-6 mb-12 md:mb-16">
          <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-3">
            Rates
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display">
            Pricing
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mt-4">
            Starting ranges. Final price depends on the work involved.
          </p>
        </div>
        <PricingSection pricing={pricing} />
      </div>
      <Footer />
    </main>
  );
}
