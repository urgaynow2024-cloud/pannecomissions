import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommissionForm from "@/components/CommissionForm";

export default function CommissionPage() {
  return (
    <main className="min-h-screen bg-black text-white antialiased">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <div className="max-w-2xl mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Commission
          </h1>
          <p className="text-lg text-gray-400">
            Fill out the form below and I&apos;ll get back to you.
          </p>
        </div>
        <CommissionForm />
      </div>
      <Footer />
    </main>
  );
}
