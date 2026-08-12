import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Services from "@/components/Services";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-black text-white antialiased">
      <Navbar />
      <div className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Services
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            What I can do for your VRChat avatar.
          </p>
        </div>
        <Services />
      </div>
      <Footer />
    </main>
  );
}
