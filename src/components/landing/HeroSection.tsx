import { ChevronDown, MessageCircle, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-[#0a0a0a] min-h-[85vh] flex items-center overflow-hidden">
      {/* Grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />
      {/* Diagonal grid lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 60px)",
        }}
      />

      <div className="relative z-10 w-full page-container py-24 md:py-32">
        <div className="max-w-3xl space-y-6">
          {/* Headline */}
          <div
            className="animate-fade-up opacity-0"
            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
          >
            <h1 className="font-display font-bold tracking-tight text-[#F0EDE8]">
              We build webapps{" "}
              <span className="text-[#FF4D2E]">for Palawan businesses.</span>
            </h1>
          </div>

          {/* Subhead */}
          <p
            className="animate-fade-up opacity-0 text-base md:text-lg text-[#888888] max-w-xl leading-relaxed"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            Resort operations, transportation booking, online ordering, real
            estate — real tools running real businesses across the island.
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-up opacity-0 flex flex-col sm:flex-row gap-3 pt-2"
            style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
          >
            <a
              href="https://wa.me/639474443597"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-[4px] bg-[#FF4D2E] text-white text-sm font-medium shadow-lg shadow-[#FF4D2E]/20 hover:bg-[#e6432a] transition-colors duration-200 min-h-[44px] w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4" />
              Chat with us on WhatsApp
            </a>
            <button
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-[4px] border border-white/[0.15] bg-transparent text-[#F0EDE8] text-sm font-medium hover:bg-white/5 transition-colors duration-200 min-h-[44px] w-full sm:w-auto"
              onClick={() =>
                document
                  .getElementById("our-apps")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              See live demos
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <a
          href="#our-apps"
          className="text-[#555555] hover:text-[#F0EDE8] transition-colors"
        >
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
