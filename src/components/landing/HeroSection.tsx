import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-palawan.jpg";
import { ChevronDown, Play, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/LocaleContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-background/90 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-5 sm:px-6 pt-24 pb-20">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          {/* Primary headline */}
          <h1 className="animate-fade-up opacity-0 text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight leading-[1.15]" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            {t("hero.headline")} {t("hero.headlineGradient")}
          </h1>
          
          {/* Subheadline */}
          <p className="animate-fade-up opacity-0 text-sm sm:text-base text-foreground/80 leading-relaxed max-w-lg mx-auto" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            {t("hero.subheadline")}
          </p>

          {/* Support line */}
          <p className="animate-fade-up opacity-0 text-xs text-muted-foreground" style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}>
            {t("hero.cloudbedsNote")}
          </p>

          {/* CTAs */}
          <div className="animate-fade-up opacity-0 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2" style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}>
            <Button 
              size="lg"
              className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate("/setup?mode=demo")}
            >
              <Play className="w-4 h-4" />
              {t("hero.startDemo")}
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="w-full sm:w-auto gap-2 border-border/50 bg-card/50 hover:bg-card"
              onClick={() => navigate("/setup?mode=live")}
            >
              <Link2 className="w-4 h-4" />
              {t("hero.connectResort")}
            </Button>
          </div>

          {/* Trust note */}
          <p className="animate-fade-up opacity-0 text-xs text-muted-foreground/80 max-w-sm mx-auto" style={{ animationDelay: '0.45s', animationFillMode: 'forwards' }}>
            {t("hero.trustNote")}
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#onboarding-steps" className="text-muted-foreground hover:text-primary transition-colors">
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
