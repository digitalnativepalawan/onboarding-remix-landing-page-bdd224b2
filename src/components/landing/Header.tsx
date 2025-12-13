import { useState, useEffect } from "react";
import { Github } from "lucide-react";

const Header = () => {
  const [manilaTime, setManilaTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString("en-US", {
        timeZone: "Asia/Manila",
        weekday: "short",
        month: "short",
        day: "numeric",
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Manila Time */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-light">
              Manila
            </span>
            <span className="text-xs sm:text-sm text-foreground/90 font-light tracking-wide">
              {manilaTime}
            </span>
          </div>

          {/* GitHub Link */}
          <a
            href="https://github.com/digitalnativepalawan/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 -mr-2"
            aria-label="View on GitHub"
          >
            <Github className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
