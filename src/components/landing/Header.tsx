import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Download, Github } from "lucide-react";
import { useTranslation } from "@/contexts/LocaleContext";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import ThemeToggle from "./ThemeToggle";

interface HeaderLink {
  id: string;
  title: string;
  url: string;
}

const TIMEZONES = [
  { id: "manila", label: "MNL", zone: "Asia/Manila" },
  { id: "london", label: "LON", zone: "Europe/London" },
  { id: "texas",  label: "TEX", zone: "America/Chicago" },
];

const Header = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [times, setTimes] = useState<Record<string, string>>({});
  const [headerLink, setHeaderLink] = useState<HeaderLink | null>(null);
  const { settings } = useSiteSettings();

  const currentLogo = theme === "dark"
    ? (settings.logo_dark_url || settings.logo_light_url)
    : (settings.logo_light_url || settings.logo_dark_url);

  const fetchHeaderLink = async () => {
    const { data } = await supabase
      .from("header_link")
      .select("*")
      .limit(1)
      .maybeSingle();
    setHeaderLink(data);
  };

  useEffect(() => {
    fetchHeaderLink();
  }, []);

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const newTimes: Record<string, string> = {};
      TIMEZONES.forEach(({ id, zone }) => {
        newTimes[id] = now.toLocaleString("en-US", {
          timeZone: zone,
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        });
      });
      setTimes(newTimes);
    };
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSettingsClick = () => {
    navigate("/admin");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/30 overflow-hidden">
        <div className="px-2 sm:px-6">
          <div className="flex items-center justify-between h-12 sm:h-14 min-w-0">

            {/* Left: Logo + clocks */}
            <div className="flex items-center gap-2 sm:gap-5 shrink-0">
              {currentLogo && (
                <img
                  src={currentLogo}
                  alt="Logo"
                  className="h-6 sm:h-7 w-auto object-contain"
                />
              )}
              {TIMEZONES.map(({ id, label }) => (
                <div key={id} className="flex items-center gap-1">
                  <span className="text-[9px] sm:text-[11px] text-foreground/50 font-medium tracking-wide">
                    {label}
                  </span>
                  <span className="text-[9px] sm:text-[11px] text-foreground font-mono tabular-nums">
                    {times[id] || "--:--"}
                  </span>
                </div>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
              {headerLink && (
                <a
                  href={headerLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-foreground/80 hover:text-foreground transition-colors p-1 sm:px-2 sm:py-1 rounded-md hover:bg-foreground/10"
                  title={headerLink.title}
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="hidden sm:inline text-xs font-medium truncate max-w-[120px] ml-1.5">
                    {headerLink.title}
                  </span>
                </a>
              )}
              <a
                href="https://github.com/digitalnativepalawan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-foreground transition-colors p-1"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://ollama.com/palawancollective"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-foreground transition-colors p-1"
                aria-label="Ollama"
              >
                <img
                  src="https://ollama.com/public/ollama.png"
                  alt="Ollama"
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-sm"
                />
              </a>
              <ThemeToggle />
              <button
                onClick={handleSettingsClick}
                className="text-foreground/80 hover:text-foreground transition-colors p-1"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
