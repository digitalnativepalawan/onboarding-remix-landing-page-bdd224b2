import { TrendingUp, Zap, Bot, Target } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Maximize Revenue",
    description: "Real-time visibility of bookings and occupancy helps you optimize pricing and reduce empty nights."
  },
  {
    icon: Zap,
    title: "Boost Efficiency",
    description: "One ecosystem for staff management, payroll, food service, and guest experience — no more switching apps."
  },
  {
    icon: Bot,
    title: "Smart Automation",
    description: "Automatic sync with booking channels, receipt scanning, and timesheet calculations save hours every day."
  },
  {
    icon: Target,
    title: "Perfect Accuracy",
    description: "Reduce manual workload and errors with OTR Scan receipts and automated payroll calculations."
  }
];

const BenefitsSection = () => {
  return (
    <section id="benefits" className="py-16 md:py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-md bg-muted/50 text-muted-foreground text-xs font-normal tracking-wide border border-border/30 mb-4">
              Benefits
            </span>
            <h2 className="section-title mb-3">Why Resort Owners Love It</h2>
            <p className="section-subtitle mx-auto">
              Built specifically for the unique challenges of remote resort management
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit) => (
              <div 
                key={benefit.title}
                className="flex gap-4 p-4 rounded-lg bg-card/50 border border-border/30 transition-all duration-200 hover:border-primary/20 hover:bg-card"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <benefit.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-medium mb-1">{benefit.title}</h3>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed font-light">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Highlight Box */}
          <div className="mt-8 p-5 md:p-6 rounded-lg border border-border/30 bg-card/30">
            <div className="text-center">
              <h3 className="text-base md:text-lg font-medium mb-2 text-primary">
                Offline Communication via BitChat
              </h3>
              <p className="text-muted-foreground text-sm font-light max-w-xl mx-auto">
                When internet fails — and in remote Palawan, it often does — your team stays connected. 
                BitChat uses Bluetooth mesh networking for reliable staff communication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;