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
    <section id="benefits" className="py-20 md:py-32">
      <div className="px-5 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className="section-tag mb-4">{t("benefits.tag")}</span>
            <h2 className="section-title mb-3">{t("benefits.title")}</h2>
            <p className="section-subtitle mx-auto">{t("benefits.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-6">
            {benefits.map((benefit) => (
              <div key={benefit.titleKey} className="flex items-start gap-4 p-5 md:p-6 rounded-xl bg-card/40 border border-border/30 hover:border-border/60 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shrink-0">
                  <benefit.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1 text-foreground">{t(benefit.titleKey)}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t(benefit.descKey)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-xl border border-primary/30 bg-primary/5 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
                <Wifi className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-sm font-medium text-primary">{t("benefits.offlineTitle")}</h3>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">{t("benefits.offlineDescription")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
