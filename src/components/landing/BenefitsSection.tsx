import { TrendingUp, Zap, Bot, Target, Wifi } from "lucide-react";
import { useTranslation } from "@/contexts/LocaleContext";

const BenefitsSection = () => {
  const { t } = useTranslation();

  const benefits = [
    { icon: TrendingUp, titleKey: "benefits.items.maximizeRevenue.title", descKey: "benefits.items.maximizeRevenue.description" },
    { icon: Zap, titleKey: "benefits.items.oneEcosystem.title", descKey: "benefits.items.oneEcosystem.description" },
    { icon: Bot, titleKey: "benefits.items.automation.title", descKey: "benefits.items.automation.description" },
    { icon: Target, titleKey: "benefits.items.accuracy.title", descKey: "benefits.items.accuracy.description" }
  ];

  return (
    <section id="benefits" className="py-20 md:py-28 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-burgundy">
            BENEFITS
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
            Why Resort Owners Use It
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground">
            {t("benefits.subtitle")}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {benefits.map((benefit) => (
            <div
              key={benefit.titleKey}
              className="bg-card border border-white/5 hover:border-white/15 transition-colors duration-300 rounded-xl p-6 md:p-7"
            >
              <div className="w-12 h-12 rounded-xl bg-burgundy/10 border border-burgundy/25 text-burgundy flex items-center justify-center">
                <benefit.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-5 text-lg md:text-xl font-semibold text-white">
                {t(benefit.titleKey)}
              </h3>
              <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">
                {t(benefit.descKey)}
              </p>
            </div>
          ))}
        </div>

        {/* Offline communication callout */}
        <div className="mt-5 bg-burgundy/5 border border-burgundy/25 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-burgundy/15 border border-burgundy/30 text-burgundy flex items-center justify-center flex-shrink-0">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-white">
              {t("benefits.offlineTitle")}
            </h3>
            <p className="mt-1 text-sm md:text-base text-muted-foreground leading-relaxed">
              {t("benefits.offlineDescription")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
