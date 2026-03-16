import { Check, Circle, Link2, DollarSign, Home, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChecklistItem {
  id: string;
  label: string;
  icon: React.ElementType;
  completed: boolean;
}

interface OnboardingChecklistProps {
  mode: "demo" | "live";
}

const OnboardingChecklist = ({ mode }: OnboardingChecklistProps) => {
  // In demo mode, show as informational
  // In live mode, show actual progress (all incomplete for now)
  const items: ChecklistItem[] = [
    {
      id: "cloudbeds",
      label: "Connect Cloudbeds bookings",
      icon: Link2,
      completed: false,
    },
    {
      id: "expenses",
      label: "Add monthly expenses",
      icon: DollarSign,
      completed: false,
    },
    {
      id: "units",
      label: "Add units / room mapping",
      icon: Home,
      completed: false,
    },
    {
      id: "staff",
      label: "Invite staff (for timesheets)",
      icon: Users,
      completed: false,
    },
  ];

  return (
    <div className="glass-card p-4 sm:p-5">
      <h3 className="text-sm font-medium text-foreground mb-4">
        {mode === "demo" ? "Get Ready to Go Live" : "Next Steps"}
      </h3>
      
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 text-sm"
          >
            {item.completed ? (
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-primary" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center shrink-0">
                <Circle className="w-3 h-3 text-muted-foreground/50" />
              </div>
            )}
            <span className={item.completed ? "text-muted-foreground line-through" : "text-foreground"}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() => window.open("https://euro.palawancollective.com/admin", "_blank")}
      >
        Go to My Account
      </Button>
    </div>
  );
};

export default OnboardingChecklist;
