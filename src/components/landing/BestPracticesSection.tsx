import { Check, Calendar, Receipt, ClipboardList, ChartBar, Users, Utensils } from "lucide-react";

const practices = [
  {
    icon: Calendar,
    text: "Edit bookings in Sirvoy — dashboard updates automatically"
  },
  {
    icon: Receipt,
    text: "Use OTR Scan for every purchase to track expenses"
  },
  {
    icon: ClipboardList,
    text: "Update expenses monthly for accurate profit tracking"
  },
  {
    icon: Users,
    text: "Use scheduling tools daily for staff coordination"
  },
  {
    icon: Utensils,
    text: "Monitor food inventory to prevent stockouts"
  },
  {
    icon: ChartBar,
    text: "Review occupancy heatmap weekly to optimize pricing"
  }
];

const BestPracticesSection = () => {
  return (
    <section id="best-practices" className="py-12 sm:py-16 md:py-20 bg-muted/20">
      <div className="px-5 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <span className="section-tag mb-3">Tips</span>
            <h2 className="section-title mb-2">Best Practices</h2>
            <p className="section-subtitle mx-auto">
              Get the most out of your dashboard
            </p>
          </div>

          {/* Checklist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {practices.map((practice, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-card/40 border border-border/20"
              >
                <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <practice.icon className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed pt-1">
                  {practice.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestPracticesSection;
