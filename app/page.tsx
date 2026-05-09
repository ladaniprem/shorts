import { AuraBackground } from "@/components/AuraBackground";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { LogoMarquee } from "@/components/LogoMarquee";
import { PhotoShowcase } from "@/components/PhotoShowcase";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { TechStackSection } from "@/components/TechStackSection";
import { SubstrateSection } from "@/components/SubstrateSection";
import { PricingSection } from "@/components/PricingSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "AI Shorts — Create Viral Short Videos with AI",
  description:
    "Transform any idea or long-form content into viral short videos for YouTube, TikTok, and Instagram in seconds. Powered by GPT-4o, ElevenLabs, and Runway ML.",
};

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <AuraBackground />
      <Navbar />
      <HeroSection />
      <LogoMarquee />
      <PhotoShowcase />
      <FeaturesSection />
      <HowItWorksSection />
      <TechStackSection />
      <SubstrateSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}