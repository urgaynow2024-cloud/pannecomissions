import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeaturedWork from "@/components/FeaturedWork";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import PricingSection from "@/components/PricingSection";
import ReviewsSection from "@/components/ReviewsSection";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white antialiased">
      <Navbar />
      <Hero />
      <FeaturedWork />
      <Services />
      <HowItWorks />
      <PricingSection />
      <ReviewsSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
