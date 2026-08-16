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
    const [portfolio, services, pricing, reviews, settings, sitePhotos] = await Promise.all([
      prisma.PortfolioItem.findMany({ where: { nsfw: false, visible: true, homepage_visible: true }, orderBy: { sort_order: "asc" } }),
      prisma.Service.findMany({ where: { visible: true }, orderBy: { sort_order: "asc" }, include: { photos: { orderBy: { sort_order: "asc" } } } }),
      prisma.Pricing.findMany({ where: { visible: true, category: "sfw" }, orderBy: { sort_order: "asc" } }),
      prisma.Review.findMany({ where: { status: "APPROVED", hidden: false }, orderBy: { created_at: "desc" }, take: 3 }),
      prisma.SiteSetting.findMany(),
      prisma.SitePhoto.findMany({ orderBy: { slug: "asc" } }),
    ]);

    const settingsMap = Object.fromEntries(settings.map((s: { key: string; value: string }) => [s.key, s.value]));

    const heroTitle = process.env.HERO_TITLE || settingsMap.hero_title || "VRCHAT AVATAR COMMISSIONS";
    const heroSubtitle = process.env.HERO_SUBTITLE || settingsMap.hero_subtitle || "Handmade VRChat avatars, outfits, textures, and toggles. Work you can feel in-game.";
    const marqueeText = process.env.MARQUEE_TEXT || settingsMap.marquee_text || "VRCHAT AVATARS ✦ CUSTOM TEXTURES ✦ TOGGLES ✦ CLOTHING ✦ MODELS ✦ AVATARS";
    const commissionAvailable = (process.env.COMMISSION_AVAILABLE || settingsMap.commission_available || "true") === "true";
    const commissionStatusText = process.env.COMMISSION_STATUS_TEXT || settingsMap.commission_status_text || "";
    const aboutText = process.env.ABOUT_TEXT || settingsMap.about_text || "I make VRChat avatars, outfits, textures and other projects people ask me to build.";
    const ctaText = process.env.CTA_TEXT || settingsMap.cta_text || "Tell Panne what you're thinking. No pressure, just a conversation about your avatar.";
    const aboutImageUrl = settingsMap.about_image_url || null;
    const featuredWorkHeading = settingsMap.featured_work_heading || null;

    const featuredWork = portfolio.slice(0, 6);

    const sitePhotoMap = Object.fromEntries(sitePhotos.map((p: { slug: string; url: string | null }) => [p.slug, p.url]));

    const heroImageUrl = sitePhotoMap['hero'] || settingsMap.hero_image_url || null;

    const servicesWithImages = services.map((service: any) => {
      const slug = service.name.toLowerCase().replace(/\s+/g, "-");
      return {
        ...service,
        image_url: sitePhotoMap[slug] || service.image_url || null,
      };
    });

    return {
      portfolio,
      services: servicesWithImages,
      pricing,
      reviews,
      featuredWork,
      heroTitle,
      heroSubtitle,
      marqueeText,
      commissionAvailable,
      commissionStatusText,
      aboutText,
      ctaText,
      aboutImageUrl,
      heroImageUrl,
      featuredWorkHeading,
      sitePhotos,
    };
  } catch {
    return {
      portfolio: [] as any[],
      services: [] as any[],
      pricing: [] as any[],
      reviews: [] as any[],
      featuredWork: [] as any[],
      heroTitle: "VRCHAT AVATAR COMMISSIONS",
      heroSubtitle: "Handmade VRChat avatars, outfits, textures, and toggles. Work you can feel in-game.",
      marqueeText: "VRCHAT AVATARS ✦ CUSTOM TEXTURES ✦ TOGGLES ✦ CLOTHING ✦ MODELS ✦ AVATARS",
      commissionAvailable: true,
      commissionStatusText: "",
      aboutText: "I make VRChat avatars, outfits, textures and other projects people ask me to build.",
      ctaText: "Tell Panne what you're thinking. No pressure, just a conversation about your avatar.",
      aboutImageUrl: null,
      heroImageUrl: null,
      featuredWorkHeading: null,
      sitePhotos: [] as any[],
    };
  }
}

export default async function Home() {
  const data = await getData();
  const featured = data.featuredWork[0] || null;

  return (
    <main className="min-h-screen text-white antialiased relative">
      <NoiseOverlay />
      <Navbar />
      <Hero featuredItem={featured} heroTitle={data.heroTitle} heroSubtitle={data.heroSubtitle} heroImageUrl={data.heroImageUrl} />
      <HorizontalStrip marqueeText={data.marqueeText} />
      <FeaturedWork items={data.featuredWork} heading={data.featuredWorkHeading || undefined} />
      <Services services={data.services} />
      <AboutSection aboutText={data.aboutText} aboutImageUrl={data.aboutImageUrl} />
      <HowItWorks />
      <PricingSection pricing={data.pricing} commissionAvailable={data.commissionAvailable} commissionStatusText={data.commissionStatusText} />
      <ReviewsSection reviews={data.reviews} />
      <FinalCTA ctaText={data.ctaText} />
      <Footer portfolioItems={data.portfolio.slice(0, 6)} />
    </main>
  );
}
