import { Receipt, TrendingDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemoExpensesWidgetProps {
  mode: "demo" | "live";
  hasData?: boolean;
}

const DemoExpensesWidget = ({ mode, hasData = false }: DemoExpensesWidgetProps) => {
  // Live mode with no data - show empty state
  if (mode === "live" && !hasData) {
    return (
      <div className="glass-card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="icon-wrapper-secondary w-8 h-8">
              <Receipt className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-medium text-foreground">Expenses</h3>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-sm text-muted-foreground mb-3 max-w-[200px]">
            Add monthly expenses to track real profit.
          </p>
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-1.5 text-xs"
            onClick={() => window.open("https://scan.palawancollective.com?mode=live", "_blank")}
          >
            <Plus className="w-3 h-3" />
            Add Expense
          </Button>
        </div>
      </div>
    );
  }

  // Demo mode - show sample data
  const expenses = [
    { category: "Payroll", amount: 45000, percent: 45 },
    { category: "Supplies", amount: 28500, percent: 28 },
    { category: "Utilities", amount: 15000, percent: 15 },
    { category: "Other", amount: 12000, percent: 12 },
  ];

  return (
    <div className="glass-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="icon-wrapper-secondary w-8 h-8">
            <Receipt className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-medium text-foreground">Expenses</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-destructive">
          <TrendingDown className="w-3 h-3" />
          <span>-5%</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-2xl font-medium text-foreground">₱ 100,500</p>
          <p className="text-xs text-muted-foreground">This month</p>
        </div>

        {/* Category breakdown */}
        <div className="space-y-2">
          {expenses.map((exp) => (
            <div key={exp.category} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{exp.category}</span>
                <span className="text-foreground">₱ {exp.amount.toLocaleString()}</span>
              </div>
              <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary-foreground/30 rounded-full"
                  style={{ width: `${exp.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoExpensesWidget;
