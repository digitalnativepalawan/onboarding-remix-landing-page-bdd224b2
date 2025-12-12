import heroBg from "@/assets/hero-palawan.jpg";
import { ChevronDown, LayoutDashboard, MapPin, ShoppingCart, ScanLine, Clock } from "lucide-react";

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
  }
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-fade-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6">
              Powered by Sirvoy.com &
              Palawan Collective
            </span>
          </div>
          
          <h1 className="animate-fade-up opacity-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Welcome to the{" "}
            <span className="gradient-text">Resort Operations Dashboard</span>
          </h1>
          
          <p className="animate-fade-up opacity-0 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            A complete system built around Sirvoy.com to manage bookings, staff, revenue, 
            food service, and daily operations — all in real time.
          </p>

          {/* Mobile-first stacked button grid */}
          <div className="animate-fade-up opacity-0 pt-6" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
              {appLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5
                    ${link.primary 
                      ? 'bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30' 
                      : 'bg-muted text-foreground border border-border hover:bg-muted/80 hover:border-primary/30'
                    }
                  `}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="text-sm sm:text-base">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
          <ChevronDown className="w-8 h-8" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
