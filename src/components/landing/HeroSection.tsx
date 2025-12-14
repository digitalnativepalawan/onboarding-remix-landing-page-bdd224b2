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
    label: "Online Order App",
    url: "https://orderonline.palawancollective.com/",
    icon: ShoppingCart
  },
  {
    label: "OTR Scan App",
    url: "https://scan.palawancollective.com/",
    icon: ScanLine
  },
  {
    label: "Employee Timesheet",
    url: "https://timesheet.palawancollective.com/",
    icon: Clock
  },
  {
    label: "Inventory App",
    url: "https://inventory.palawancollective.com/",
    icon: Package
  }
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - dimmed and blurred */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-24 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Primary headline */}
          <h1 className="animate-fade-up opacity-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-tight" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            Run Your Resort with{" "}
            <span className="gradient-text">Palawan Collective</span>
          </h1>
          
          {/* Supporting sub-headline */}
          <p className="animate-fade-up opacity-0 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Sirvoy manages your bookings. Palawan Collective runs your staff, finances, food, and daily resort operations — all in one dashboard.
          </p>

          {/* Context line */}
          <div className="animate-fade-up opacity-0" style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/40 text-muted-foreground/70 text-xs tracking-wide border border-border/20">
              Connected to Sirvoy for real-time reservation data
            </span>
          </div>

          {/* App features grid */}
          <div className="animate-fade-up opacity-0 pt-6" style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}>
            <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-4">Your Operations Tools</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {appLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link.primary ? 'action-tile-primary' : 'action-tile'}
                >
                  <link.icon className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm font-normal text-foreground/90">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#how-it-works" className="text-muted-foreground/50 hover:text-primary transition-colors">
          <ChevronDown className="w-6 h-6" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;