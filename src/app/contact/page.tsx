import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NoiseOverlay from "@/components/NoiseOverlay";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-brand-black text-white antialiased relative">
      <NoiseOverlay />
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pt-32 md:pt-40 pb-20 md:pb-32">
        <div className="mb-12 md:mb-16">
          <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-3">
            Contact
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display heading-pop">
            Got a Question?
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mt-4">
            Have a question before commissioning? Send me a message.
          </p>
        </div>
        <ContactForm />
      </div>
      <Footer />
    </main>
  );
}
