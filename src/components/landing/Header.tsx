import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Download, Github } from "lucide-react";
import { useTranslation } from "@/contexts/LocaleContext";
import { supabase } from "@/integrations/supabase/client";

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
  const navigate = useNavigate();
  const [times, setTimes] = useState<Record<string, string>>({});
  const [headerLink, setHeaderLink] = useState<HeaderLink | null>(null);

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

            {/* 3 world clocks */}
            <div className="flex items-center gap-2 sm:gap-5 shrink-0">
              {TIMEZONES.map(({ id, label }) => (
                <div key={id} className="flex items-center gap-1">
                  <span className="text-[9px] sm:text-[11px] text-white/50 font-medium tracking-wide">
                    {label}
                  </span>
                  <span className="text-[9px] sm:text-[11px] text-white font-mono tabular-nums">
                    {times[id] || "--:--"}
                  </span>
                </div>
              ))}
            </div>

            {/* Right side actions — no locale switcher */}
            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
              {headerLink && (
                <a
                  href={headerLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white/80 hover:text-white transition-colors p-1 sm:px-2 sm:py-1 rounded-md hover:bg-white/10"
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
                className="text-white/80 hover:text-white transition-colors p-1"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://ollama.com/palawancollective"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors p-1"
                aria-label="Ollama"
              >
                <img
                  src="https://ollama.com/public/ollama.png"
                  alt="Ollama"
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-sm"
                />
              </a>
              <button
                onClick={handleSettingsClick}
                className="text-white/80 hover:text-white transition-colors p-1"
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
