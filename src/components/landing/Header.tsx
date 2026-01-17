import { useState, useEffect } from "react";
import { Github, Settings } from "lucide-react";
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

  // Show only first 2 timezones on mobile, all on tablet+
  const mobileTimezones = TIMEZONES.slice(0, 2);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/30">
        <div className="px-3 sm:px-6">
          <div className="flex items-center justify-between h-12 sm:h-14">
            {/* Mobile: show 2 timezones, Tablet+: show all */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Mobile timezones */}
              <div className="flex sm:hidden items-center gap-3">
                {mobileTimezones.map(({ id, label }) => (
                  <div key={id} className="flex items-center gap-1.5">
                    <span className="text-xs text-white/70 font-medium">{label}</span>
                    <span className="text-xs text-white font-mono tabular-nums">{times[id] || "--:--"}</span>
                  </div>
                ))}
              </div>
              {/* Tablet+ timezones */}
              <div className="hidden sm:flex items-center gap-4">
                {TIMEZONES.map(({ id, label }) => (
                  <div key={id} className="flex items-center gap-1.5">
                    <span className="text-xs text-white/70 font-medium">{label}</span>
                    <span className="text-xs text-white font-mono tabular-nums">{times[id] || "--:--"}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <LocaleSwitcher />
              <button
                onClick={handleSettingsClick}
                className="text-white/80 hover:text-white transition-colors p-1.5"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <a
                href="https://github.com/palawancollective"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors p-1.5"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
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
        onOpenChange={setShowAdminSettings}
      />
    </>
  );
};

export default Header;
