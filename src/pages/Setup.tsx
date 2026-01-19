import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, Sparkles, Building2, UtensilsCrossed, Package, Receipt, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface App {
  id: string;
  name: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
}

const APPS: App[] = [
  {
    id: "backoffice",
    name: "Backoffice Dashboard",
    shortDesc: "Occupancy, income, expenses",
    icon: Building2,
    url: "https://onboarding.heatmap.palawancollective.com",
  },
  {
    id: "orders",
    name: "Online Orders",
    shortDesc: "Guest food, drinks, tours",
    icon: UtensilsCrossed,
    url: "https://onboarding.online.order.palawancollective.com",
  },
  {
    id: "inventory",
    name: "Kitchen Inventory",
    shortDesc: "Stock and food cost",
    icon: Package,
    url: "https://onboarding.inventory.palawancollective.com",
  },
  {
    id: "otr",
    name: "OTR Scan",
    shortDesc: "Scan receipts to expenses",
    icon: Receipt,
    url: "https://scan.palawancollective.com",
  },
  {
    id: "timesheet",
    name: "Timesheet",
    shortDesc: "Staff clock-in and payroll",
    icon: Clock,
    url: "https://onboarding.timesheet.palawancollective.com",
  },
];

export default function Setup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Pre-select app from URL param if provided
  const preselectedApp = searchParams.get("app");
  // Pre-select mode from URL param if provided (demo or live)
  const preselectedMode = searchParams.get("mode");
  
  const [step, setStep] = useState(1);
  const [selectedApps, setSelectedApps] = useState<string[]>(
    preselectedApp ? [preselectedApp, "backoffice"].filter((v, i, a) => a.indexOf(v) === i) : ["backoffice"]
  );
  const [mode, setMode] = useState<"demo" | "live">(
    preselectedMode === "live" ? "live" : "demo"
  );

  const toggleApp = (appId: string) => {
    setSelectedApps((prev) =>
      prev.includes(appId)
        ? prev.filter((id) => id !== appId)
        : [...prev, appId]
    );
  };

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/");
    }
  };

  const handleStartApp = (appId: string, appUrl: string) => {
    // All apps are external - open in new tab with mode param
    const url = new URL(appUrl);
    url.searchParams.set("mode", mode);
    window.open(url.toString(), "_blank");
  };

  const selectedAppDetails = APPS.filter((app) => selectedApps.includes(app.id));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold truncate">Set Up Your Resort Tools</h1>
              <p className="text-sm text-muted-foreground truncate">
                Choose what you want to use now. You can add more later.
              </p>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={cn(
                    "h-2 flex-1 rounded-full transition-colors",
                    s <= step ? "bg-primary" : "bg-muted"
                  )}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Step {step} of 3</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Step 1: Choose Tools */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-xl font-semibold mb-2">Choose Your Tools</h2>
              <p className="text-sm text-muted-foreground">
                You can start with one app and add others later.
              </p>
            </div>

            <div className="space-y-3">
              {APPS.map((app) => {
                const Icon = app.icon;
                const isSelected = selectedApps.includes(app.id);
                
                return (
                  <button
                    key={app.id}
                    onClick={() => toggleApp(app.id)}
                    className={cn(
                      "w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <div
                      className={cn(
                        "shrink-0 w-12 h-12 rounded-lg flex items-center justify-center",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{app.name}</span>
                        {app.id === "backoffice" && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {app.shortDesc}
                      </p>
                    </div>
                    <div className="shrink-0 mt-1">
                      <Checkbox
                        checked={isSelected}
                        className="pointer-events-none"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Choose Mode */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-xl font-semibold mb-2">Choose Your Mode</h2>
              <p className="text-sm text-muted-foreground">
                Demo mode is safe and does not affect your real systems.
              </p>
            </div>

            <RadioGroup
              value={mode}
              onValueChange={(value) => setMode(value as "demo" | "live")}
              className="space-y-3"
            >
              <label
                className={cn(
                  "flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  mode === "demo"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <div
                  className={cn(
                    "shrink-0 w-12 h-12 rounded-lg flex items-center justify-center",
                    mode === "demo" ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}
                >
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Explore with Demo Data</span>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    View sample bookings, staff, orders, and expenses to see how everything works.
                  </p>
                </div>
                <RadioGroupItem value="demo" className="mt-1 shrink-0" />
              </label>

              <label
                className={cn(
                  "flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  mode === "live"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <div
                  className={cn(
                    "shrink-0 w-12 h-12 rounded-lg flex items-center justify-center",
                    mode === "live" ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}
                >
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium">Connect My Real Resort Data</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Use your own bookings and operations right away.
                  </p>
                </div>
                <RadioGroupItem value="live" className="mt-1 shrink-0" />
              </label>
            </RadioGroup>

            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground">
                💡 <strong className="text-foreground">Tip:</strong> You can switch between demo and live data anytime from within each app.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Choose Starting App */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-xl font-semibold mb-2">Start with Your First App</h2>
              <p className="text-sm text-muted-foreground">
                You can open other apps anytime from the dashboard or bookmarks.
              </p>
            </div>

            <div className="space-y-3">
              {selectedAppDetails.map((app, index) => {
                const Icon = app.icon;
                const isRecommended = app.id === "backoffice";
                
                return (
                  <Button
                    key={app.id}
                    onClick={() => handleStartApp(app.id, app.url)}
                    variant={isRecommended ? "default" : "outline"}
                    className={cn(
                      "w-full h-auto p-4 flex items-center gap-4 justify-start",
                      isRecommended && "bg-primary hover:bg-primary/90"
                    )}
                  >
                    <div
                      className={cn(
                        "shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                        isRecommended
                          ? "bg-primary-foreground/20"
                          : "bg-muted"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        {isRecommended && (
                          <span className="text-yellow-300">⭐</span>
                        )}
                        <span className="font-medium">
                          {isRecommended ? `${app.name} (recommended)` : `Start with ${app.name}`}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-sm mt-0.5",
                          isRecommended
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {app.shortDesc}
                      </p>
                    </div>
                  </Button>
                );
              })}
            </div>

            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground">
                🚀 <strong className="text-foreground">Mode:</strong>{" "}
                {mode === "demo" ? "Demo Data" : "Live Data"} — All apps will open in this mode.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Fixed bottom button for steps 1-2 */}
      {step < 3 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border p-4">
          <div className="container mx-auto">
            <Button
              onClick={handleContinue}
              disabled={step === 1 && selectedApps.length === 0}
              className="w-full h-12 text-base font-medium"
            >
              Continue
              {step === 1 && selectedApps.length > 0 && (
                <span className="ml-2 bg-primary-foreground/20 px-2 py-0.5 rounded-full text-sm">
                  {selectedApps.length} selected
                </span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
