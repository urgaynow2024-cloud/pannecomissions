import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NoiseOverlay from "@/components/NoiseOverlay";
import Hero from "@/components/Hero";
import FeaturedWork from "@/components/FeaturedWork";
import Services from "@/components/Services";
import AboutSection from "@/components/AboutSection";
import HowItWorks from "@/components/HowItWorks";
import HorizontalStrip from "@/components/HorizontalStrip";
import PricingSection from "@/components/PricingSection";
import ReviewsSection from "@/components/ReviewsSection";
import FinalCTA from "@/components/FinalCTA";
import prisma from "@/lib/prisma";

export const revalidate = 60;

async function getData() {
  try {
    const [portfolio, services, pricing, reviews] = await Promise.all([
      prisma.PortfolioItem.findMany({ where: { nsfw: false, visible: true }, orderBy: { sort_order: "asc" } }),
      prisma.Service.findMany({ where: { visible: true }, orderBy: { sort_order: "asc" } }),
      prisma.Pricing.findMany({ where: { visible: true, category: "sfw" }, orderBy: { sort_order: "asc" } }),
      prisma.Review.findMany({ where: { status: "APPROVED", hidden: false }, orderBy: { created_at: "desc" }, take: 3 }),
    ]);

    const featuredWork = portfolio.slice(0, 6);

    return { portfolio, services, pricing, reviews, featuredWork };
  } catch {
    return { portfolio: [], services: [], pricing: [], reviews: [], featuredWork: [] };
  }
}

export default async function Home() {
  const { portfolio, services, pricing, reviews, featuredWork } = await getData();
  const featured = featuredWork[0] || null;

  return (
    <main className="min-h-screen text-white antialiased relative">
      <NoiseOverlay />
      <Navbar />
      <Hero featuredItem={featured} />
      <HorizontalStrip />
      <FeaturedWork items={featuredWork} />
      <Services services={services} />
      <AboutSection />
      <HowItWorks />
      <PricingSection pricing={pricing} />
      <ReviewsSection reviews={reviews} />
      <FinalCTA />
      <Footer portfolioItems={portfolio.slice(0, 6)} />
    </main>
  );
}
