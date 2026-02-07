import { Calendar, TrendingUp, Home, Plus, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemoOccupancyWidgetProps {
  mode: "demo" | "live";
  hasData?: boolean;
}

// Sample demo data for occupancy heatmap
const DEMO_UNITS = ["Cabana 1", "Cabana 2", "Beach Hut", "Tree House", "Tent 1"];
const DEMO_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const generateDemoHeatmap = () => {
  return DEMO_UNITS.map((unit) => ({
    unit,
    days: DEMO_DAYS.map((day) => ({
      day,
      status: Math.random() > 0.35 ? "booked" : Math.random() > 0.5 ? "partial" : "available",
    })),
  }));
};

const DEMO_DATA = generateDemoHeatmap();

const DemoOccupancyWidget = ({ mode, hasData = false }: DemoOccupancyWidgetProps) => {
  // Live mode with no data - show empty state
  if (mode === "live" && !hasData) {
    return (
      <div className="glass-card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="icon-wrapper w-8 h-8">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-medium text-foreground">Occupancy</h3>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
            <Home className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-4 max-w-[200px]">
            No bookings yet. Connect Cloudbeds or add manual reservations.
          </p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-1.5 text-xs"
              onClick={() => window.open("https://onboarding.heatmap.palawancollective.com?mode=live", "_blank")}
            >
              <Link2 className="w-3 h-3" />
              Connect Cloudbeds
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="gap-1.5 text-xs"
              onClick={() => window.open("https://onboarding.heatmap.palawancollective.com?mode=live", "_blank")}
            >
              <Plus className="w-3 h-3" />
              Add Manual
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Demo mode or live mode with data - show heatmap
  return (
    <div className="glass-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="icon-wrapper w-8 h-8">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-medium text-foreground">Occupancy Heatmap</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-primary">
          <TrendingUp className="w-3 h-3" />
          <span>72%</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="min-w-[320px]">
          {/* Header row */}
          <div className="flex gap-1 mb-1">
            <div className="w-20 shrink-0" />
            {DEMO_DAYS.map((day) => (
              <div key={day} className="flex-1 text-center text-xs text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {DEMO_DATA.map((row) => (
            <div key={row.unit} className="flex gap-1 mb-1">
              <div className="w-20 shrink-0 text-xs text-muted-foreground truncate py-1.5">
                {row.unit}
              </div>
              {row.days.map((cell, i) => (
                <div
                  key={i}
                  className={`flex-1 h-7 rounded transition-colors ${
                    cell.status === "booked"
                      ? "bg-primary/60"
                      : cell.status === "partial"
                      ? "bg-primary/25"
                      : "bg-muted/40"
                  }`}
                  title={`${row.unit} - ${cell.day}: ${cell.status}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-primary/60" />
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-primary/25" />
          <span>Partial</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-muted/40" />
          <span>Available</span>
        </div>
      </div>
    </div>
  );
};

export default DemoOccupancyWidget;
