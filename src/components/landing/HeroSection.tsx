import heroBg from "@/assets/hero-palawan.jpg";
import { ChevronDown } from "lucide-react";

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
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-fade-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6">
              Powered by Sirvoy.com &
              Palawan Collective
            </span>
          </div>
          
          <h1 className="animate-fade-up opacity-0 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Welcome to the{" "}
            <span className="gradient-text">Resort Operations Dashboard</span>
          </h1>
          
          <p className="animate-fade-up opacity-0 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            A complete system built around Sirvoy.com to manage bookings, staff, revenue, 
            food service, and daily operations — all in real time.
          </p>

          <div className="animate-fade-up opacity-0 flex flex-col sm:flex-row gap-4 justify-center pt-4 flex-wrap" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <a 
              href="https://host.palawancollective.com/transactions" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Dashboard
            </a>
            <a 
              href="https://occupancy.palawancollective.com/" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-muted text-foreground font-semibold border border-border transition-all duration-300 hover:bg-muted/80 hover:border-primary/30"
            >
              Occupancy Heatmap
            </a>
            <a 
              href="https://orderonline.palawancollective.com/" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-muted text-foreground font-semibold border border-border transition-all duration-300 hover:bg-muted/80 hover:border-primary/30"
            >
              Online Order App
            </a>
            <a 
              href="https://scan.palawancollective.com/" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-muted text-foreground font-semibold border border-border transition-all duration-300 hover:bg-muted/80 hover:border-primary/30"
            >
              OTR Scan App
            </a>
            <a 
              href="https://timesheet.palawancollective.com/" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-muted text-foreground font-semibold border border-border transition-all duration-300 hover:bg-muted/80 hover:border-primary/30"
            >
              Employee Timesheet App
            </a>
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
