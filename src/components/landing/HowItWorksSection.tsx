import { Webhook, Globe, Zap, RefreshCw, Link2, Database } from "lucide-react";

const features = [
  {
    icon: Webhook,
    title: "Live Webhooks",
    description: "Booking updates sync instantly"
  },
  {
    icon: Globe,
    title: "Multi-Channel",
    description: "Booking.com, Agoda, Airbnb"
  },
  {
    icon: Database,
    title: "Data Export",
    description: "Analyze guest patterns"
  },
  {
    icon: Link2,
    title: "10 Webhook Slots",
    description: "SMS, housekeeping, accounting"
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-12 sm:py-16 md:py-20">
      <div className="px-5 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <span className="section-tag mb-3">Integration</span>
            <h2 className="section-title mb-2">How It Works</h2>
            <p className="section-subtitle mx-auto">
              Sirvoy sends booking data to Palawan Collective in real time
            </p>
          </div>

          {/* Main Card */}
          <div className="glass-card p-5 sm:p-6">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-normal mb-1">Sirvoy Integration</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  Sirvoy is your <span className="text-foreground/80">booking engine</span>. 
                  Palawan Collective is your <span className="text-foreground/80">operations dashboard</span>. 
                  They work together through live webhooks.
                </p>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {features.map((feature) => (
                <div 
                  key={feature.title}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/20 border border-border/20"
                >
                  <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <feature.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-normal mb-0.5 truncate">{feature.title}</h4>
                    <p className="text-[0.65rem] text-muted-foreground/70 leading-tight">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sync Status */}
            <div className="mt-5 pt-4 border-t border-border/20 flex items-center justify-center gap-2 text-muted-foreground/50">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-[0.65rem]">Syncing with booking channels</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
