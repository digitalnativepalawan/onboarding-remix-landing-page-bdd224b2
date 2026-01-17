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
    <section id="benefits" className="py-12 sm:py-16 md:py-20">
      <div className="px-5 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="section-tag mb-3">{t("benefits.tag")}</span>
            <h2 className="section-title mb-2">{t("benefits.title")}</h2>
            <p className="section-subtitle mx-auto">{t("benefits.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {benefits.map((benefit) => (
              <div key={benefit.titleKey} className="flex items-start gap-3 p-4 rounded-lg bg-card/40 border border-border/20">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <benefit.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-normal mb-0.5">{t(benefit.titleKey)}</h3>
                  <p className="text-xs text-white/70 leading-relaxed">{t(benefit.descKey)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg border border-border/20 bg-card/20 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wifi className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-normal text-primary">{t("benefits.offlineTitle")}</h3>
            </div>
            <p className="text-xs text-white/70 max-w-sm mx-auto leading-relaxed">{t("benefits.offlineDescription")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
