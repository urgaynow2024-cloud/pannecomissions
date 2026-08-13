import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NoiseOverlay from "@/components/NoiseOverlay";
import Services from "@/components/Services";
import prisma from "@/lib/prisma";

export const revalidate = 60;

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

export default async function ServicesPage() {
  const services = await getData();

  return (
    <main className="min-h-screen bg-brand-black text-white antialiased relative">
      <NoiseOverlay />
      <Navbar />
      <div className="pt-32 md:pt-40 pb-20 md:pb-32">
        <div className="mx-auto max-w-7xl px-6 mb-12 md:mb-16">
          <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-3">
            What I Do
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display">
            Services
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mt-4">
            Work tailored to your VRChat avatar needs.
          </p>
        </div>
        <Services services={services} />
      </div>
      <Footer />
    </main>
  );
}
