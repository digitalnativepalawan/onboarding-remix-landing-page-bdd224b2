import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  ArrowLeft,
  ExternalLink
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

  const openBackoffice = () => {
    window.open("https://euro.palawancollective.com/admin", "_blank");
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
            {/* Open Backoffice */}
            <Button
              onClick={openBackoffice}
              variant="outline"
              className="gap-2 w-full sm:w-auto"
            >
              <ExternalLink className="w-4 h-4" />
              Open Backoffice
            </Button>

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
