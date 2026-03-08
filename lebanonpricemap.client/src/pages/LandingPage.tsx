import CTASection from "@/components/landing/CTASection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HeroSection from "@/components/landing/HeroSection";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingNavbar from "@/components/landing/LandingNavbar";

import LogicSection from "@/components/landing/LogicSection";
import QuoteSection from "@/components/landing/QuoteSection";


export function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-base overflow-x-hidden blueprint-grid">
      <LandingNavbar />
      <HeroSection />
      <LogicSection />
      <FeaturesSection/>
      <QuoteSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}