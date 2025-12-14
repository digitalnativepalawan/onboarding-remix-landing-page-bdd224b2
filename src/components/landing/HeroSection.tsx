import heroBg from "@/assets/hero-palawan.jpg";
import { ChevronDown, LayoutDashboard, MapPin, ShoppingCart, ScanLine, Clock, Package } from "lucide-react";

const appLinks = [
  {
    label: "Dashboard",
    url: "https://host.palawancollective.com/transactions",
    icon: LayoutDashboard,
    primary: true
  },
  {
    label: "Occupancy Heatmap",
    url: "https://occupancy.palawancollective.com/",
    icon: MapPin
  },
  {
    label: "Online Orders",
    url: "https://orderonline.palawancollective.com/",
    icon: ShoppingCart
  },
  {
    label: "OTR Scan",
    url: "https://scan.palawancollective.com/",
    icon: ScanLine
  },
  {
    label: "Timesheet",
    url: "https://timesheet.palawancollective.com/",
    icon: Clock
  },
  {
    label: "Inventory",
    url: "https://inventory.palawancollective.com/",
    icon: Package
  }
];

const HeroSection = () => {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-background/90 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-5 sm:px-6 pt-24 pb-20">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          {/* Primary headline */}
          <h1 className="animate-fade-up opacity-0 text-[1.65rem] sm:text-3xl md:text-4xl font-medium tracking-tight leading-[1.15]" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            Run Your Resort with{" "}
            <span className="gradient-text">Palawan Collective</span>
          </h1>
          
          {/* Supporting sub-headline */}
          <p className="animate-fade-up opacity-0 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Sirvoy manages your bookings. Palawan Collective runs your staff, finances, food, and daily resort operations.
          </p>

          {/* Context line */}
          <div className="animate-fade-up opacity-0" style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/30 text-muted-foreground/60 text-xs border border-border/20">
              Connected to Sirvoy for real-time booking data
            </span>
          </div>

          {/* App features grid */}
          <div className="animate-fade-up opacity-0 pt-4" style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}>
            <p className="text-[0.65rem] text-muted-foreground/50 uppercase tracking-widest mb-3">Your Tools</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-lg mx-auto">
              {appLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all duration-200 ${
                    link.primary 
                      ? 'border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50' 
                      : 'border-border/40 bg-card/40 hover:bg-card/60 hover:border-border/60'
                  }`}
                >
                  <link.icon className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-xs text-foreground/80">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#how-it-works" className="text-muted-foreground/40 hover:text-primary transition-colors">
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
