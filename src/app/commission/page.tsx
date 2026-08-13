import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NoiseOverlay from "@/components/NoiseOverlay";
import CommissionForm from "@/components/CommissionForm";
import prisma from "@/lib/prisma";

export const revalidate = 60;

async function getData() {
  try {
    const services = await prisma.Service.findMany({
      where: { visible: true },
      orderBy: { sort_order: "asc" },
    });

    return services.map((service: { id: string; name: string }) => ({
      id: service.id,
      name: service.name,
    }));
  } catch {
    return [];
  }
}

export default async function CommissionPage() {
  const services = await getData();

  return (
    <main className="min-h-screen bg-brand-black text-white antialiased relative">
      <NoiseOverlay />
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pt-32 md:pt-40 pb-20 md:pb-32">
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-3">
            Commission
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display">
            Start a Project
          </h1>
          <p className="text-lg text-gray-400 mt-4">
            Fill out the form below and I&apos;ll get back to you.
          </p>
        </div>
        <CommissionForm services={services} />
      </div>
      <Footer />
    </main>
  );
}
