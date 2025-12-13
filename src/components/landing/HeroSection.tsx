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
      <div className="relative z-10 container mx-auto px-4 pt-16 pb-24 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Quote */}
          <div className="animate-fade-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground/90 italic font-light">
              "From one Palawan resort owner to another: stop doing this the hard way."
            </p>
          </div>

          {/* Slim badge */}
          <div className="animate-fade-up opacity-0" style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 text-muted-foreground text-xs font-normal tracking-wide border border-border/30">
              Powered by Sirvoy.com & Palawan Collective
            </span>
          </div>
          
          {/* Thin headline */}
          <h1 className="animate-fade-up opacity-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-tight" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Welcome to the{" "}
            <span className="gradient-text">Resort Operations Dashboard</span>
          </h1>
          
          {/* Lighter tagline */}
          <p className="animate-fade-up opacity-0 text-sm sm:text-base md:text-lg text-muted-foreground/80 max-w-xl mx-auto leading-relaxed font-light" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            A complete system built around Sirvoy.com to manage bookings, staff, revenue, 
            food service, and daily operations — all in real time.
          </p>

          {/* Modern action tiles grid */}
          <div className="animate-fade-up opacity-0 pt-4" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
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