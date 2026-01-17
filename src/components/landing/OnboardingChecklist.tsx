import { 
  Link2, 
  UserPlus, 
  UtensilsCrossed, 
  ScanLine, 
  Package, 
  RefreshCw, 
  LayoutDashboard,
  CheckCircle2
} from "lucide-react";

const checklistItems = [
  {
    icon: Link2,
    title: "Connect Sirvoy",
    description: "Link your booking engine to start receiving real-time reservation data"
  },
  {
    icon: UserPlus,
    title: "Add your first employee",
    description: "Set up a staff member in the Timesheet module"
  },
  {
    icon: UtensilsCrossed,
    title: "Create your food menu",
    description: "Add your first menu items to enable guest ordering"
  },
  {
    icon: ScanLine,
    title: "Scan your first receipt",
    description: "Use OTR Scan to digitize a paper receipt"
  },
  {
    icon: Package,
    title: "Log your first inventory item",
    description: "Track supplies or materials in the Inventory module"
  },
  {
    icon: RefreshCw,
    title: "Review your first booking sync",
    description: "Check that Sirvoy data is flowing into Occupancy"
  },
  {
    icon: LayoutDashboard,
    title: "Explore the dashboard",
    description: "Familiarize yourself with the Occupancy & Profit view"
  }
];

const OnboardingChecklist = () => {
  return (
    <section className="py-10 sm:py-14 bg-background">
      <div className="px-5 sm:px-6 max-w-2xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs border border-primary/20 mb-3">
            <CheckCircle2 className="w-3 h-3" />
            Getting Started
          </span>
          <h2 className="text-lg sm:text-xl font-medium text-foreground mb-2">
            First 7 Actions for New Resort Owners
          </h2>
          <p className="text-sm text-white/80 font-light">
            An optional guide to help you get started. Complete these at your own pace — each action naturally activates a module.
          </p>
        </div>

        {/* Checklist */}
        <div className="space-y-2.5">
          {checklistItems.map((item, index) => (
            <div 
              key={item.title}
              className="flex items-start gap-3 p-3 rounded-lg border border-border/30 bg-card/40 hover:bg-card/60 transition-colors"
            >
              {/* Step Number */}
              <div className="w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center text-xs text-white/70 font-medium shrink-0">
                {index + 1}
              </div>
              
              {/* Icon */}
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              
              {/* Content */}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-normal text-white">{item.title}</h3>
                <p className="text-xs text-white/70 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <p className="text-xs text-white/60 text-center mt-5 font-light">
          This checklist is informational only. There are no required steps or forced flows.
        </p>
      </div>
    </section>
  );
};

export default OnboardingChecklist;
