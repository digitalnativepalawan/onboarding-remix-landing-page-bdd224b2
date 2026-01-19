import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  ArrowLeft,
  Home,
  UtensilsCrossed,
  Package,
  Receipt,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ModeBanner from "@/components/dashboard/ModeBanner";
import ModeToggle from "@/components/dashboard/ModeToggle";
import OnboardingChecklist from "@/components/dashboard/OnboardingChecklist";
import DemoOccupancyWidget from "@/components/dashboard/DemoOccupancyWidget";
import DemoRevenueWidget from "@/components/dashboard/DemoRevenueWidget";
import DemoExpensesWidget from "@/components/dashboard/DemoExpensesWidget";
import DemoProfitWidget from "@/components/dashboard/DemoProfitWidget";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Read mode from URL query param
  const mode = (searchParams.get("mode") as "demo" | "live") || "demo";
  const source = searchParams.get("source");
  
  // In a real app, this would check actual data
  // For now, demo mode always has data, live mode has no data
  const hasData = mode === "demo";

  // External app URLs
  const EXTERNAL_APP_URLS: Record<string, string> = {
    rooms: "https://onboarding.heatmap.palawancollective.com",
    orders: "https://onboarding.online.order.palawancollective.com",
    inventory: "https://onboarding.inventory.palawancollective.com",
    receipts: "https://scan.palawancollective.com",
    timesheet: "https://onboarding.timesheet.palawancollective.com",
  };

  // Quick nav apps
  const quickApps = [
    { id: "rooms", name: "Rooms", icon: Home, color: "primary" },
    { id: "orders", name: "Orders", icon: UtensilsCrossed, color: "primary" },
    { id: "inventory", name: "Inventory", icon: Package, color: "secondary" },
    { id: "receipts", name: "Receipts", icon: Receipt, color: "secondary" },
    { id: "timesheet", name: "Timesheet", icon: Clock, color: "primary" },
  ];

  const openExternalApp = (appId: string) => {
    const url = new URL(EXTERNAL_APP_URLS[appId]);
    url.searchParams.set("mode", mode);
    window.open(url.toString(), "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mode Banner */}
      <ModeBanner mode={mode} hasData={hasData} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h1 className="text-sm font-medium text-foreground">Backoffice Dashboard</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Occupancy, income, expenses
                  </p>
                </div>
              </div>
            </div>
            
            {/* Mode Toggle */}
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Dashboard Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick App Access */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
              {quickApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => openExternalApp(app.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border shrink-0 transition-colors ${
                    app.color === "primary"
                      ? "border-primary/20 bg-primary/5 hover:bg-primary/10"
                      : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  <app.icon className={`w-4 h-4 ${
                    app.color === "primary" ? "text-primary" : "text-muted-foreground"
                  }`} />
                  <span className="text-sm text-foreground">{app.name}</span>
                </button>
              ))}
            </div>

            {/* Occupancy Widget - Full width on top */}
            <DemoOccupancyWidget mode={mode} hasData={hasData} />

            {/* Revenue, Expenses, Profit Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DemoRevenueWidget mode={mode} hasData={hasData} />
              <DemoExpensesWidget mode={mode} hasData={hasData} />
            </div>

            {/* Profit Widget */}
            <DemoProfitWidget mode={mode} hasData={hasData} />
          </div>

          {/* Sidebar - Onboarding Checklist */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20">
              <OnboardingChecklist mode={mode} />

              {/* Additional help for first-time users */}
              {source === "setup" && (
                <div className="mt-4 glass-card p-4">
                  <p className="text-xs text-muted-foreground">
                    You came from setup. Explore the dashboard above to see how your data will look.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
