import { Webhook, Globe, Zap, RefreshCw, Link2, Database } from "lucide-react";
import { useTranslation } from "@/contexts/LocaleContext";

const HowItWorksSection = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Webhook, titleKey: "howItWorks.features.liveWebhooks.title", descKey: "howItWorks.features.liveWebhooks.description" },
    { icon: Globe, titleKey: "howItWorks.features.multiChannel.title", descKey: "howItWorks.features.multiChannel.description" },
    { icon: Database, titleKey: "howItWorks.features.dataExport.title", descKey: "howItWorks.features.dataExport.description" },
    { icon: Link2, titleKey: "howItWorks.features.webhookSlots.title", descKey: "howItWorks.features.webhookSlots.description" }
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 md:py-20">
      <div className="px-5 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className="section-tag mb-3">{t("howItWorks.tag")}</span>
            <h2 className="section-title mb-2">{t("howItWorks.title")}</h2>
            <p className="section-subtitle mx-auto">{t("howItWorks.subtitle")}</p>
          </div>

          <div className="glass-card p-5 sm:p-6">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-normal mb-1">{t("howItWorks.sirvoyIntegration")}</h3>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed">{t("howItWorks.sirvoyDescription")}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {features.map((feature) => (
                <div key={feature.titleKey} className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/20 border border-border/20">
                  <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <feature.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-normal mb-0.5 truncate">{t(feature.titleKey)}</h4>
                    <p className="text-[0.65rem] text-white/70 leading-tight">{t(feature.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-border/20 flex items-center justify-center gap-2 text-white/60">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-[0.65rem]">{t("howItWorks.syncStatus")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
