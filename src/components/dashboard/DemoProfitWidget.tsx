import { TrendingUp, Wallet, Target } from "lucide-react";

interface DemoProfitWidgetProps {
  mode: "demo" | "live";
  hasData?: boolean;
}

const DemoProfitWidget = ({ mode, hasData = false }: DemoProfitWidgetProps) => {
  // Live mode with no data - show empty state
  if (mode === "live" && !hasData) {
    return (
      <div className="glass-card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="icon-wrapper w-8 h-8">
              <Wallet className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-medium text-foreground">Net Profit</h3>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-sm text-muted-foreground max-w-[200px]">
            Profit will be calculated once revenue and expenses are tracked.
          </p>
        </div>
      </div>
    );
  }

  // Demo mode - show sample data
  const revenue = 142500;
  const expenses = 100500;
  const profit = revenue - expenses;
  const margin = Math.round((profit / revenue) * 100);

  return (
    <div className="glass-card p-4 sm:p-5 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="icon-wrapper w-8 h-8">
            <Wallet className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-medium text-foreground">Net Profit</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-primary">
          <TrendingUp className="w-3 h-3" />
          <span>{margin}% margin</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-2xl font-medium text-primary">₱ {profit.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">This month</p>
        </div>

        {/* Profit breakdown visual */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Revenue</span>
            <span className="text-foreground">₱ {revenue.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Expenses</span>
            <span className="text-foreground">- ₱ {expenses.toLocaleString()}</span>
          </div>
          <div className="border-t border-border pt-2 flex items-center justify-between text-xs">
            <span className="text-primary font-medium">Net Profit</span>
            <span className="text-primary font-medium">₱ {profit.toLocaleString()}</span>
          </div>
        </div>

        {/* Target indicator */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs">
            <Target className="w-3.5 h-3.5 text-primary" />
            <span className="text-muted-foreground">Break-even target:</span>
            <span className="text-foreground">₱ 85,000</span>
          </div>
          <p className="text-xs text-primary mt-1">✓ Above target by ₱ 57,000</p>
        </div>
      </div>
    </div>
  );
};

export default DemoProfitWidget;
