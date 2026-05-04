import { useEffect, useState } from "react";
import { MessageCircle, ArrowRight } from "lucide-react";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import AgencyAppsSection from "@/components/landing/AgencyAppsSection";
import BackofficeShowcaseSection from "@/components/landing/BackofficeShowcaseSection";
import BlogSection from "@/components/landing/BlogSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import FAQSection from "@/components/landing/FAQSection";
import FeedbackSection from "@/components/landing/FeedbackSection";
import Footer from "@/components/landing/Footer";
import ScrollFloaters from "@/components/landing/ScrollFloaters";

const StickyMobileCTA = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={`md:hidden fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pt-3 border-t border-white/[0.08] bg-[#0a0a0a]/90 backdrop-blur-xl transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-2">
        <a
          href="https://wa.me/639474443597"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-[4px] bg-[#FF4D2E] text-white text-sm font-medium shadow-lg shadow-[#FF4D2E]/20 active:scale-[0.98] transition-transform min-h-[44px]"
        >
          <MessageCircle className="w-4 h-4" />
          Talk to Us
        </a>
        <a
          href="#our-apps"
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-[4px] border border-white/[0.15] bg-transparent text-[#F0EDE8] text-sm font-medium active:scale-[0.98] transition-transform min-h-[44px]"
        >
          See work
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <HeroSection />
      <AgencyAppsSection />
      <BackofficeShowcaseSection />
      <BenefitsSection />
      <BlogSection />
      <FAQSection />
      <FeedbackSection />
      <Footer />
      <ScrollFloaters />
      <StickyMobileCTA />
    </div>
  );
};

export default Index;
