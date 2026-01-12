import { Calendar, Receipt, ClipboardList, ChartBar, Users, Utensils } from "lucide-react";
import { useTranslation } from "@/contexts/LocaleContext";

const BestPracticesSection = () => {
  const { t } = useTranslation();

  const practices = [
    { icon: Calendar, key: "bestPractices.items.editBookings" },
    { icon: Receipt, key: "bestPractices.items.useOtrScan" },
    { icon: ClipboardList, key: "bestPractices.items.updateExpenses" },
    { icon: Users, key: "bestPractices.items.useScheduling" },
    { icon: Utensils, key: "bestPractices.items.monitorFood" },
    { icon: ChartBar, key: "bestPractices.items.reviewOccupancy" }
  ];

  return (
    <section id="best-practices" className="py-12 sm:py-16 md:py-20 bg-muted/20">
      <div className="px-5 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className="section-tag mb-3">{t("bestPractices.tag")}</span>
            <h2 className="section-title mb-2">{t("bestPractices.title")}</h2>
            <p className="section-subtitle mx-auto">{t("bestPractices.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {practices.map((practice, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-card/40 border border-border/20">
                <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <practice.icon className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed pt-1">{t(practice.key)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestPracticesSection;
