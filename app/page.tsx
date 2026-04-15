import ConceptSection from "@/components/ConceptSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import MarketingCasesSection from "@/components/MarketingCasesSection";
import Navbar from "@/components/Navbar";
import ProblemSection from "@/components/ProblemSection";
import ValueSection from "@/components/ValueSection";
import VisionSection from "@/components/VisionSection";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <VisionSection />
      <ConceptSection />
      <ValueSection />
      <MarketingCasesSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
