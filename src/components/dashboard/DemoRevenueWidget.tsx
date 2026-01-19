import { DollarSign, TrendingUp, Plus, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemoRevenueWidgetProps {
  mode: "demo" | "live";
  hasData?: boolean;
}

const DemoRevenueWidget = ({ mode, hasData = false }: DemoRevenueWidgetProps) => {
  // Live mode with no data - show empty state
  if (mode === "live" && !hasData) {
    return (
      <div className="glass-card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="icon-wrapper w-8 h-8">
              <DollarSign className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-medium text-foreground">Revenue</h3>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-sm text-muted-foreground mb-3 max-w-[200px]">
            Revenue will appear once reservations or orders are recorded.
          </p>
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-1.5 text-xs"
            onClick={() => window.open("https://onboarding.heatmap.palawancollective.com?mode=live", "_blank")}
          >
            <Link2 className="w-3 h-3" />
            Connect Booking Source
          </Button>
        </div>
      </div>
    );
  }

  // Demo mode - show sample data
  return (
    <div className="glass-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="icon-wrapper w-8 h-8">
            <DollarSign className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-medium text-foreground">Revenue</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-primary">
          <TrendingUp className="w-3 h-3" />
          <span>+12%</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-2xl font-medium text-foreground">₱ 142,500</p>
          <p className="text-xs text-muted-foreground">This month</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Bookings</p>
            <p className="text-sm font-medium text-foreground">₱ 98,000</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Orders</p>
            <p className="text-sm font-medium text-foreground">₱ 44,500</p>
          </div>
        </div>

        {/* Mini bar chart simulation */}
        <div className="flex items-end gap-1 h-12">
          {[35, 52, 48, 72, 65, 85, 78].map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-primary/40 rounded-t transition-all hover:bg-primary/60"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Mon</span>
          <span>Sun</span>
        </div>
      </div>
    </div>
  );
};

export default DemoRevenueWidget;
