import { useEffect, useRef } from "react";
import { TrendingUp, Zap, Bot, Target, Wifi } from "lucide-react";
import { useTranslation } from "@/contexts/LocaleContext";

const BenefitsSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  const benefits = [
    { icon: TrendingUp, titleKey: "benefits.items.maximizeRevenue.title", descKey: "benefits.items.maximizeRevenue.description" },
    { icon: Zap, titleKey: "benefits.items.oneEcosystem.title", descKey: "benefits.items.oneEcosystem.description" },
    { icon: Bot, titleKey: "benefits.items.automation.title", descKey: "benefits.items.automation.description" },
    { icon: Target, titleKey: "benefits.items.accuracy.title", descKey: "benefits.items.accuracy.description" },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("fade-up-visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    const cards = section.querySelectorAll(".fade-up-hidden");
    cards.forEach((card, i) => {
      (card as HTMLElement).style.transitionDelay = `${i * 100}ms`;
      observer.observe(card);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section id="benefits" ref={sectionRef} className="section-padding">
      <div className="page-container">
        <div className="text-center max-w-2xl mx-auto">
          <span className="section-tag">BENEFITS</span>
          <h2 className="mt-3 font-display font-semibold tracking-tight text-[#F0EDE8]">
            Why Resort Owners Use It
          </h2>
          <p className="mt-4 text-base text-[#888888]">
            {t("benefits.subtitle")}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {benefits.map((benefit) => (
            <div
              key={benefit.titleKey}
              className="glass-card-hover p-6 md:p-7 fade-up-hidden"
            >
              <div className="w-12 h-12 rounded-lg bg-[#FF4D2E]/10 border border-[#FF4D2E]/25 text-[#FF4D2E] flex items-center justify-center">
                <benefit.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-5 font-display font-semibold text-[#F0EDE8]">
                {t(benefit.titleKey)}
              </h3>
              <p className="mt-2 text-sm text-[#888888] leading-relaxed">
                {t(benefit.descKey)}
              </p>
            </div>
          ))}
        </div>

        {/* Offline communication callout */}
        <div className="mt-5 glass-card p-6 md:p-8 flex flex-col md:flex-row items-start gap-4 border-l-[3px] border-l-[#FF4D2E] fade-up-hidden">
          <div className="w-12 h-12 rounded-full bg-[#FF4D2E]/10 border border-[#FF4D2E]/25 text-[#FF4D2E] flex items-center justify-center flex-shrink-0">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-[#F0EDE8]">
              {t("benefits.offlineTitle")}
            </h3>
            <p className="mt-1 text-sm text-[#888888] leading-relaxed">
              {t("benefits.offlineDescription")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
