import { useState, useEffect } from "react";
import { Settings, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminSettingsModal from "./AdminSettingsModal";
import LocaleSwitcher from "./LocaleSwitcher";
import { useTranslation } from "@/contexts/LocaleContext";
import { supabase } from "@/integrations/supabase/client";

interface HeaderLink {
  id: string;
  title: string;
  url: string;
}

const ADMIN_PASSKEY = "5309";

const TIMEZONES = [
  { id: "manila", label: "MNL", zone: "Asia/Manila" },
  { id: "italy", label: "ITA", zone: "Europe/Rome" },
  { id: "germany", label: "GER", zone: "Europe/Berlin" },
  { id: "texas", label: "TEX", zone: "America/Chicago" },
];

const Header = () => {
  const { t } = useTranslation();
  const [times, setTimes] = useState<Record<string, string>>({});
  const [showPasskeyDialog, setShowPasskeyDialog] = useState(false);
  const [showAdminSettings, setShowAdminSettings] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
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
    setPasskey("");
    setError("");
    setShowPasskeyDialog(true);
  };

  const handlePasskeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkey === ADMIN_PASSKEY) {
      setShowPasskeyDialog(false);
      setShowAdminSettings(true);
      setPasskey("");
      setError("");
    } else {
      setError(t("header.incorrectPasskey"));
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/30 overflow-hidden">
        <div className="px-2 sm:px-6">
          <div className="flex items-center justify-between h-12 sm:h-14 min-w-0">
            {/* All 4 timezones - tighter on mobile */}
            <div className="flex items-center gap-1 sm:gap-4 shrink-0">
              {TIMEZONES.map(({ id, label }) => (
                <div key={id} className="flex items-center gap-0.5 sm:gap-1">
                  <span className="text-[8px] sm:text-xs text-white/70 font-medium">{label}</span>
                  <span className="text-[8px] sm:text-xs text-white font-mono tabular-nums">{times[id] || "--:--"}</span>
                </div>
              ))}
            </div>
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
                  <span className="hidden sm:inline text-xs font-medium truncate max-w-[120px] ml-1.5">{headerLink.title}</span>
                </a>
              )}
              <LocaleSwitcher />
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

      {/* Passkey Dialog */}
      <Dialog open={showPasskeyDialog} onOpenChange={setShowPasskeyDialog}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>{t("header.adminAccess")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasskeySubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="passkey">{t("header.enterPasskey")}</Label>
              <Input
                id="passkey"
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="••••"
                autoFocus
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
            <Button type="submit" className="w-full">
              {t("header.accessSettings")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Admin Settings Modal */}
      <AdminSettingsModal
        open={showAdminSettings}
        onOpenChange={(open) => {
          setShowAdminSettings(open);
          if (!open) fetchHeaderLink();
        }}
      />
    </>
  );
};

export default Header;
