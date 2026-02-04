import { Eye, ClipboardList, Rocket } from "lucide-react";
import { useTranslation } from "@/contexts/LocaleContext";

const OnboardingStrip = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: Eye,
      step: "1",
      title: t("onboardingStrip.step1.title"),
      subtitle: t("onboardingStrip.step1.subtitle"),
      description: t("onboardingStrip.step1.description")
    },
    {
      icon: ClipboardList,
      step: "2",
      title: t("onboardingStrip.step2.title"),
      subtitle: t("onboardingStrip.step2.subtitle"),
      description: t("onboardingStrip.step2.description")
    },
    {
      icon: Rocket,
      step: "3",
      title: t("onboardingStrip.step3.title"),
      subtitle: t("onboardingStrip.step3.subtitle"),
      description: t("onboardingStrip.step3.description")
    }
  ];

  return (
    <section id="onboarding-steps" className="py-10 sm:py-14 bg-muted/20 border-y border-border/30">
      <div className="px-5 sm:px-6 max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-lg sm:text-xl font-medium text-foreground">
            {t("onboardingStrip.title")}
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {steps.map((item) => (
            <div 
              key={item.step}
              className="relative flex flex-col items-center text-center p-4 rounded-lg border border-border/30 bg-card/40"
            >
              {/* Step number badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                {item.step}
              </div>
              
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mt-2 mb-3">
                <item.icon className="w-5 h-5" />
              </div>
              
              {/* Title */}
              <h3 className="text-sm font-medium text-foreground mb-1">
                {item.title}
                {item.subtitle && (
                  <span className="block text-xs text-primary font-normal">{item.subtitle}</span>
                )}
              </h3>
              
              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <p className="text-xs text-muted-foreground/80 text-center mt-6">
          {t("onboardingStrip.footer")}
        </p>
      </div>
    </section>
  );
};

export default OnboardingStrip;
