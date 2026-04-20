import { ChevronDown, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import defaultLogo from "@/assets/palawan-collective-logo.png";

const HeroSection = () => {
  const { theme } = useTheme();
  const { settings } = useSiteSettings();

  return (
    <section className="relative bg-[#0A0A0C] min-h-[80vh] md:min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden">
      {/* Burgundy radial glows — absolute against section */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] lg:w-[800px] lg:h-[800px] -translate-y-1/4 translate-x-1/4"
        style={{
          background:
            "radial-gradient(circle, hsl(355 70% 55% / 0.12), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 w-[600px] h-[600px] translate-y-1/3 -translate-x-1/3"
        style={{
          background:
            "radial-gradient(circle, hsl(355 70% 55% / 0.05), transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-8 grid lg:grid-cols-5 gap-8 items-center">
        <div className="lg:col-span-3 space-y-6 text-left">
          {/* Tag chip */}
          <div
            className="animate-fade-up opacity-0"
            style={{ animationDelay: "0.05s", animationFillMode: "forwards" }}
          >
            <span className="inline-flex w-fit px-4 py-1.5 rounded-full bg-burgundy/10 border border-burgundy/25 text-burgundy text-[11px] font-medium uppercase tracking-[0.15em]">
              Digital Agency · Palawan, Philippines
            </span>
          </div>

          {/* Headline */}
          <div
            className="animate-fade-up opacity-0 space-y-1"
            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-white">
              We build webapps
            </h1>
            <p className="text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-burgundy">
              for Palawan businesses.
            </p>
          </div>

          {/* Subhead */}
          <p
            className="animate-fade-up opacity-0 text-base md:text-lg text-[#A1A1AA] max-w-xl mt-6 leading-relaxed"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            Resort operations, transportation booking, online ordering, real
            estate — real tools running real businesses across the island.
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-up opacity-0 flex flex-col md:flex-row gap-3 mt-8"
            style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
          >
            <Button
              size="lg"
              className="w-full md:w-auto gap-2 h-12 px-7 rounded-full bg-burgundy hover:bg-burgundy text-white border-0 shadow-lg shadow-burgundy/30 hover:scale-[1.02] transition-transform duration-200"
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
              className="w-full md:w-auto gap-2 h-12 px-7 rounded-full border border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white"
              onClick={() =>
                document
                  .getElementById("our-apps")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              See live demos
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Trust line */}
          <p
            className="animate-fade-up opacity-0 text-xs uppercase tracking-[0.15em] text-[#71717A] mt-8"
            style={{ animationDelay: "0.45s", animationFillMode: "forwards" }}
          >
            Based in Palawan · 6 live projects · Serving local businesses since 2023
          </p>
        </div>

        <div className="hidden lg:block lg:col-span-2" aria-hidden />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <a
          href="#our-apps"
          className="text-[#71717A] hover:text-white transition-colors"
        >
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
