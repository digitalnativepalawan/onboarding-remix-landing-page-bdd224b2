import { useState } from "react";
import { Home, Users, Utensils, Package, Wallet, Shield, ArrowRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ModuleGroup {
  icon: typeof Home;
  title: string;
  color: "primary" | "secondary";
  dataEnters: string;
  ownerSees: string;
  setupRequired: string;
}

const moduleGroups: ModuleGroup[] = [
  {
    icon: Home,
    title: "Run Your Rooms",
    color: "primary",
    dataEnters: "Reservations from Cloudbeds, manual bookings, occupancy logs",
    ownerSees: "Occupancy calendar, revenue per unit, booking timeline, profit margin",
    setupRequired: "Connect Cloudbeds API key, add room/unit list with rates"
  },
  {
    icon: Users,
    title: "Run Your Team",
    color: "secondary",
    dataEnters: "Clock-ins, schedules, absences, overtime",
    ownerSees: "Weekly schedule, payroll summary, attendance history, labor cost",
    setupRequired: "Add employees with roles and daily rates"
  },
  {
    icon: Utensils,
    title: "Run Your Kitchen & Bar",
    color: "primary",
    dataEnters: "Guest orders, menu items, ingredient costs",
    ownerSees: "Order queue, daily sales, food cost %, margin by item",
    setupRequired: "Create menu with categories, set ingredient costs"
  },
  {
    icon: Package,
    title: "Run Your Supplies",
    color: "secondary",
    dataEnters: "Scanned receipts, manual entries, stock counts",
    ownerSees: "Inventory levels, expense log, supplier history, reorder alerts",
    setupRequired: "Scan first receipt or add inventory items manually"
  },
  {
    icon: Wallet,
    title: "Run Your Money",
    color: "primary",
    dataEnters: "All transactions: bookings, sales, expenses, payroll",
    ownerSees: "Daily profit, cash flow, expense breakdown, accountant export",
    setupRequired: "Other modules feed data automatically"
  },
  {
    icon: Shield,
    title: "Stay Compliant",
    color: "secondary",
    dataEnters: "Receipts, employee records, tax categories",
    ownerSees: "BIR-ready reports, receipt archive, audit trail",
    setupRequired: "Configure tax settings, assign receipt categories"
  }
];

const ModuleGroupsSection = () => {
  const [selectedModule, setSelectedModule] = useState<ModuleGroup | null>(null);

  return (
    <section id="modules" className="py-12 sm:py-16 bg-muted/20">
      <div className="px-5 sm:px-6 max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted/40 text-muted-foreground/80 text-xs tracking-wide border border-border/30 mb-3">
            Your Operations
          </span>
          <h2 className="text-xl sm:text-2xl font-medium text-foreground mb-2">
            Six areas. One system.
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Each module handles a core part of running your resort. Tap to see what goes in, what comes out, and what you need to set up.
          </p>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {moduleGroups.map((module) => (
            <button
              key={module.title}
              onClick={() => setSelectedModule(module)}
              className="flex items-center gap-3 p-4 rounded-lg border border-border/40 bg-card/50 hover:bg-card hover:border-primary/30 transition-all text-left group"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                module.color === 'primary' 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-secondary text-secondary-foreground'
              }`}>
                <module.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground">{module.title}</h3>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Module Detail Modal */}
      <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-foreground">
              {selectedModule && (
                <>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    selectedModule.color === 'primary' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    <selectedModule.icon className="w-4 h-4" />
                  </div>
                  {selectedModule.title}
                </>
              )}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Details about {selectedModule?.title}
            </DialogDescription>
          </DialogHeader>
          
          {selectedModule && (
            <div className="space-y-4 mt-2">
              <div className="p-3 rounded-lg bg-muted/30 border border-border/20">
                <h4 className="text-xs text-primary font-medium mb-1.5">What data enters this system</h4>
                <p className="text-sm text-foreground/80">{selectedModule.dataEnters}</p>
              </div>
              
              <div className="p-3 rounded-lg bg-muted/30 border border-border/20">
                <h4 className="text-xs text-primary font-medium mb-1.5">What you'll see first</h4>
                <p className="text-sm text-foreground/80">{selectedModule.ownerSees}</p>
              </div>
              
              <div className="p-3 rounded-lg bg-muted/30 border border-border/20">
                <h4 className="text-xs text-primary font-medium mb-1.5">What must be set up to go live</h4>
                <p className="text-sm text-foreground/80">{selectedModule.setupRequired}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ModuleGroupsSection;
