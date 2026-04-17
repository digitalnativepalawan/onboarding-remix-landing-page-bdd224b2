import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import OnboardingStrip from "@/components/landing/OnboardingStrip";
import DataFlowSection from "@/components/landing/DataFlowSection";
import ModuleGroupsSection from "@/components/landing/ModuleGroupsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import BestPracticesSection from "@/components/landing/BestPracticesSection";
import FAQSection from "@/components/landing/FAQSection";
import FeedbackSection from "@/components/landing/FeedbackSection";
import Footer from "@/components/landing/Footer";
import ScrollFloaters from "@/components/landing/ScrollFloaters";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <OnboardingStrip />
      <DataFlowSection />
      <ModuleGroupsSection />
      <HowItWorksSection />
      <BenefitsSection />
      <BestPracticesSection />
      <FAQSection />
      <FeedbackSection />
      <Footer />
      <ScrollFloaters />
    </div>
  );
};

export default Index;
