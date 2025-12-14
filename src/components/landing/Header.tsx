import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

interface HeaderProps {
  currentStep?: number;
  totalSteps?: number;
  stepLabel?: string;
}

const Header = ({ currentStep = 1, totalSteps = 5, stepLabel = "Sirvoy Setup" }: HeaderProps) => {
  const [manilaTime, setManilaTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString("en-US", {
        timeZone: "Asia/Manila",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setManilaTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/30">
      <div className="container mx-auto px-4">
        {/* Mobile: Stacked layout */}
        <div className="flex flex-col py-2 md:hidden">
          {/* Row 1: Brand + Help */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Palawan Collective
            </span>
            <a
              href="https://wa.me/639474443597"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors p-1.5 -mr-1.5"
              aria-label="Get help via WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
          
          {/* Row 2: Subtitle */}
          <span className="text-xs text-muted-foreground/70 mt-0.5">
            Host Onboarding & System Guide
          </span>
          
          {/* Row 3: Step indicator + Time */}
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-xs text-foreground/80">
              Step {currentStep} of {totalSteps} · {stepLabel}
            </span>
            <span className="text-[10px] text-muted-foreground/60">
              Manila · {manilaTime}
            </span>
          </div>
        </div>

        {/* Tablet & Desktop: Single row */}
        <div className="hidden md:flex items-center justify-between h-12">
          {/* Left: Brand + Subtitle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">
              Palawan Collective
            </span>
            <span className="text-xs text-muted-foreground/60">·</span>
            <span className="text-xs text-muted-foreground/70">
              Host Onboarding & System Guide
            </span>
          </div>

          {/* Center: Step indicator */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <span className="text-xs text-foreground/80 font-medium">
              Step {currentStep} of {totalSteps} · {stepLabel}
            </span>
          </div>

          {/* Right: Time + Help */}
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-muted-foreground/60">
              Manila · {manilaTime}
            </span>
            <a
              href="https://wa.me/639474443597"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors p-1.5 -mr-1.5"
              aria-label="Get help via WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
