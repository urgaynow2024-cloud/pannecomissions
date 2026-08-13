import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SparkleSystem from "@/components/SparkleSystem";
import NoiseOverlay from "@/components/NoiseOverlay";
import Hero from "@/components/Hero";
import FeaturedWork from "@/components/FeaturedWork";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
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

    const featured = portfolio.find((p: { featured: boolean }) => p.featured) || portfolio[0] || null;
    const featuredForSection = portfolio.filter((p: { featured: boolean }) => p.featured).slice(0, 3);
    const featuredWork = featuredForSection.length > 0 ? featuredForSection : portfolio.slice(0, 3);

    return { portfolio, services, pricing, reviews, featured, featuredWork };
  } catch {
    return { portfolio: [], services: [], pricing: [], reviews: [], featured: null, featuredWork: [] };
  }
}

export default async function Home() {
  const { portfolio, services, pricing, reviews, featured, featuredWork } = await getData();

  return (
    <main className="min-h-screen bg-brand-black text-white antialiased relative">
      <SparkleSystem />
      <NoiseOverlay />
      <Navbar />
      <Hero featuredItem={featured} />
      <FeaturedWork items={featuredWork} />
      <Services services={services} />
      <HowItWorks />
      <PricingSection pricing={pricing} />
      <ReviewsSection reviews={reviews} />
      <FinalCTA />
      <Footer />
    </main>
  );
}
