import { useState, useEffect, useCallback, useRef } from "react";
import { Lock } from "lucide-react";
import screenHome from "@/assets/screen-home.png";
import screenService from "@/assets/screen-service.png";
import screenResortOps from "@/assets/screen-resort-ops.png";
import screenCashier from "@/assets/screen-cashier.png";

const TABS = [
  { label: "Reception", color: "#2dd4bf", image: screenHome },
  { label: "Service Mode", color: "#f59e0b", image: screenService },
  { label: "Resort Ops", color: "#818cf8", image: screenResortOps },
  { label: "Cashier", color: "#34d399", image: screenCashier },
] as const;

const INTERVAL = 4000;

const AppPreview = () => {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(Date.now());

  const resetTimer = useCallback((index: number) => {
    setActive(index);
    setProgress(0);
    startRef.current = Date.now();
  }, []);

  // Auto-rotation
  useEffect(() => {
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / INTERVAL) * 100, 100);
      setProgress(pct);
      if (elapsed >= INTERVAL) {
        setActive((prev) => (prev + 1) % TABS.length);
        startRef.current = Date.now();
        setProgress(0);
      }
    }, 30);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const accent = TABS[active].color;

  return (
    <div className="w-full max-w-[860px] mx-auto px-4 animate-fade-up opacity-0" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
      {/* Tab buttons */}
      <div className="flex gap-2 justify-center mb-3 flex-wrap">
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => resetTimer(i)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300"
            style={{
              background: i === active ? tab.color : "hsl(var(--muted))",
              color: i === active ? "#0a0a0a" : "hsl(var(--muted-foreground))",
              boxShadow: i === active ? `0 0 12px ${tab.color}40` : "none",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Browser frame */}
      <div
        className="rounded-xl overflow-hidden transition-all duration-500"
        style={{
          border: `1.5px solid ${accent}40`,
          boxShadow: `0 0 30px ${accent}15, 0 0 60px ${accent}08`,
        }}
      >
        {/* Chrome bar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1a2e] border-b border-border/30">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          {/* URL bar */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-background/40 text-[11px] text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span>euro.palawancollective.com</span>
              <span
                className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-colors duration-500"
                style={{ background: `${accent}30`, color: accent }}
              >
                {TABS[active].label}
              </span>
            </div>
          </div>
          {/* Spacer for symmetry */}
          <div className="w-[42px]" />
        </div>

        {/* Screenshot area */}
        <div className="relative bg-[#0d1117] overflow-hidden" style={{ maxHeight: 460 }}>
          {TABS.map((tab, i) => (
            <img
              key={tab.label}
              src={tab.image}
              alt={`${tab.label} screenshot`}
              className="w-full object-cover object-top transition-opacity duration-500 select-none"
              style={{
                maxHeight: 460,
                opacity: i === active ? 1 : 0,
                position: i === active ? "relative" : "absolute",
                top: 0,
                left: 0,
              }}
              draggable={false}
            />
          ))}

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-background/20">
            <div
              className="h-full transition-[width] duration-75 ease-linear"
              style={{
                width: `${progress}%`,
                background: accent,
                boxShadow: `0 0 8px ${accent}80`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-2 justify-center mt-3">
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => resetTimer(i)}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: i === active ? tab.color : "hsl(var(--muted))",
              transform: i === active ? "scale(1.4)" : "scale(1)",
              boxShadow: i === active ? `0 0 6px ${tab.color}60` : "none",
            }}
            aria-label={`View ${tab.label}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AppPreview;
