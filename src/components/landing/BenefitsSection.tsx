import { TrendingUp, Zap, Bot, Target, Wifi } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Maximize Revenue",
    description: "Real-time occupancy helps you optimize pricing and reduce empty nights."
  },
  {
    icon: Zap,
    title: "One Ecosystem",
    description: "Staff, payroll, food, and guests — stop switching between apps."
  },
  {
    icon: Bot,
    title: "Automation",
    description: "Booking sync, receipt scanning, and payroll run automatically."
  },
  {
    icon: Target,
    title: "Accuracy",
    description: "OTR receipts and automated calculations reduce manual errors."
  }
];

const BenefitsSection = () => {
  return (
    <section id="benefits" className="py-12 sm:py-16 md:py-20">
      <div className="px-5 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <span className="section-tag mb-3">Benefits</span>
            <h2 className="section-title mb-2">Why Resort Owners Use It</h2>
            <p className="section-subtitle mx-auto">
              Built for the unique challenges of remote island resorts
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {benefits.map((benefit) => (
              <div 
                key={benefit.title}
                className="flex items-start gap-3 p-4 rounded-lg bg-card/40 border border-border/20"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <benefit.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-normal mb-0.5">{benefit.title}</h3>
                  <p className="text-xs text-muted-foreground/70 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* BitChat Highlight */}
          <div className="p-4 rounded-lg border border-border/20 bg-card/20 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wifi className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-normal text-primary">Offline Communication</h3>
            </div>
            <p className="text-xs text-muted-foreground/70 max-w-sm mx-auto leading-relaxed">
              When internet fails — and in Palawan, it often does — BitChat keeps your staff connected via Bluetooth mesh.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
