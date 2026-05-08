import CTASection from "@/components/landing/CTASection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HeroSection from "@/components/landing/HeroSection";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LogicSection from "@/components/landing/LogicSection";
import QuoteSection from "@/components/landing/QuoteSection";
import { Seo } from "@/components/Seo";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-base overflow-x-hidden">
      <Seo
        path="/"
        title="Compare Live Prices Across Lebanon"
        description="Find the cheapest groceries, fuel and essentials in Beirut, Tripoli, Sidon, Zahle and across Lebanon. Verified retailer prices, updated daily."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "WeinArkhass",
          url: "https://weinarkhass.com",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://weinarkhass.com/map?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />
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