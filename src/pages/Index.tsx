import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import StatsStrip from "../components/landing/StatsStrip";
import FeaturesSection from "../components/landing/FeaturesSection";
import SubjectsPreview from "../components/landing/SubjectsPreview";
import HowItWorks from "../components/landing/HowItWorks";
import PricingSection from "../components/landing/PricingSection";
import Footer from "../components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsStrip />
      <FeaturesSection />
      <SubjectsPreview />
      <HowItWorks />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Index;
