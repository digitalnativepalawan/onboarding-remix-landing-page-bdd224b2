import { Webhook, Globe, Zap, RefreshCw, Link2, Database } from "lucide-react";

const features = [
  {
    icon: Webhook,
    title: "Live Webhooks",
    description: "Every booking, modification, or cancellation instantly updates the occupancy heatmap"
  },
  {
    icon: Globe,
    title: "Multi-Channel Sync",
    description: "Connects to Booking.com, Agoda, Airbnb, VRBO, and your direct website"
  },
  {
    icon: Database,
    title: "Data Export",
    description: "Export booking data to analyze guest demographics and patterns"
  },
  {
    icon: Link2,
    title: "10 Webhook Slots",
    description: "Supports up to 10 simultaneous webhooks for SMS, housekeeping, and accounting"
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-md bg-muted/50 text-muted-foreground text-xs font-normal tracking-wide border border-border/30 mb-4">
              Integration
            </span>
            <h2 className="section-title mb-3">How the System Works</h2>
            <p className="section-subtitle mx-auto">
              Powered by Sirvoy.com, our dashboard receives real-time updates through webhooks
            </p>
          </div>

          {/* Main Card */}
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="icon-wrapper-secondary shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-medium mb-1.5">Real-Time Sirvoy Integration</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-light">
                  This dashboard is <span className="text-primary font-normal">powered by Sirvoy.com</span> and{" "}
                  <span className="text-primary font-normal">Palawan Collective Inc.</span> — 
                  a comprehensive property management system. Through live webhooks, 
                  your dashboard stays synchronized with all booking channels.
                </p>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid sm:grid-cols-2 gap-3">
              {features.map((feature) => (
                <div 
                  key={feature.title}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 transition-all duration-200 hover:border-primary/20 hover:bg-muted/50"
                >
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <feature.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-0.5">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground font-light">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sync Animation */}
            <div className="mt-6 pt-6 border-t border-border/30 flex items-center justify-center gap-2 text-muted-foreground/70">
              <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-xs font-light">Syncing with booking channels in real-time</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;