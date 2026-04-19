import { ChevronDown, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import defaultLogo from "@/assets/palawan-collective-logo.png";

const HeroSection = () => {
  const { theme } = useTheme();
  const { settings } = useSiteSettings();

  const logo = theme === "dark"
    ? (settings.logo_dark_url || settings.logo_light_url || defaultLogo)
    : (settings.logo_light_url || settings.logo_dark_url || defaultLogo);

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-background">
      <div className="relative z-10 w-full px-5 sm:px-6 pt-24 pb-20">
        {/* Logo */}
        <div
          className="max-w-2xl mx-auto mb-6 flex justify-center animate-fade-up opacity-0"
          style={{ animationDelay: "0.02s", animationFillMode: "forwards" }}
        >
          <img
            src={logo}
            alt="Palawan Collective"
            className="h-48 sm:h-60 w-auto select-none"
            draggable={false}
          />
        </div>

        <div className="max-w-2xl mx-auto text-center space-y-5">
          {/* Tag */}
          <div
            className="animate-fade-up opacity-0 flex justify-center"
            style={{ animationDelay: "0.05s", animationFillMode: "forwards" }}
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium tracking-wide">
              Digital Agency · Palawan, Philippines
            </span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-up opacity-0 text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight leading-[1.15]"
            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
          >
            We build webapps
            <br />
            <span className="gradient-text">for Palawan businesses</span>
          </h1>

          {/* Subheadline */}
          <p
            className="animate-fade-up opacity-0 text-sm sm:text-base text-foreground/80 leading-relaxed max-w-lg mx-auto"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            Resort operations, transportation booking, online ordering, real
            estate — real tools running real businesses across the island.
          </p>

          {/* Who we build for */}
          <div
            className="animate-fade-up opacity-0 flex flex-wrap justify-center gap-2 pt-1"
            style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
          >
            {[
              "Resort owners",
              "Restaurants & shops",
              "Transport operators",
              "Land sellers",
            ].map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-muted/40 border border-border/30 text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div
            className="animate-fade-up opacity-0 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
            style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
          >
            <Button
              size="lg"
              className="w-full sm:w-auto gap-2 bg-[#25D366] hover:bg-[#1fb356] text-white border-0"
              onClick={() =>
                window.open("https://wa.me/639474443597", "_blank")
              }
            >
              <MessageCircle className="w-4 h-4" />
              Chat with us on WhatsApp
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto gap-2"
              onClick={() =>
                document
                  .getElementById("our-apps")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              See our work
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Trust note */}
          <p
            className="animate-fade-up opacity-0 text-xs text-muted-foreground/70 max-w-sm mx-auto"
            style={{ animationDelay: "0.45s", animationFillMode: "forwards" }}
          >
            Based in Palawan · 6 live webapps · Serving local businesses since
            2023
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <a
          href="#our-apps"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
