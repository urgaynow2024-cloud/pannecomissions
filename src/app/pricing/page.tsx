import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NoiseOverlay from "@/components/NoiseOverlay";
import PricingSection from "@/components/PricingSection";
import prisma from "@/lib/prisma";

export const revalidate = 30;

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
      <NoiseOverlay />
      <Navbar />
      <div className="pt-32 md:pt-40 pb-20 md:pb-32">
        <PricingSection pricing={pricing} />
      </div>
      <Footer />
    </main>
  );
}
