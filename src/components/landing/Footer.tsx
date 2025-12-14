import { useState } from "react";
import { MapPin, Phone, Mail, Globe, ExternalLink } from "lucide-react";
import LegalModal from "./LegalModal";

type LegalType = "terms" | "privacy" | "security" | null;

const Footer = () => {
  const [activeLegal, setActiveLegal] = useState<LegalType>(null);

  const productLinks = [
    { name: "Dashboard Overview", href: "https://host.palawancollective.com/transactions" },
    { name: "Occupancy & Profit", href: "https://occupancy.palawancollective.com/" },
    { name: "Timesheet & Payroll", href: "https://timesheet.palawancollective.com/" },
    { name: "Online Ordering", href: "https://orderonline.palawancollective.com/" },
    { name: "OTR Scan", href: "https://scan.palawancollective.com/" },
    { name: "Developer Tools", href: "#" },
    { name: "Host Onboarding", href: "#" },
  ];

  const legalLinks = [
    { name: "Terms of Service", key: "terms" as LegalType },
    { name: "Privacy Policy", key: "privacy" as LegalType },
    { name: "Data & Security", key: "security" as LegalType },
  ];

  const bookingChannels = ["Airbnb", "Booking.com", "Agoda"];

  return (
    <footer className="bg-background border-t border-border/30 pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">
          
          {/* Brand & Contact Column */}
          <div className="space-y-5">
            <div>
              <h3 className="text-foreground text-base font-medium mb-1">Palawan Collective Inc.</h3>
              <p className="text-muted-foreground/70 text-sm leading-relaxed">
                Resort Operations & Hospitality Software for Palawan
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-sm text-muted-foreground/70">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary/60" />
                <span>Sitio Lumambong Beach, Palawan Island 5309, Philippines</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground/70">
                <Phone className="w-4 h-4 shrink-0 text-primary/60" />
                <a 
                  href="https://wa.me/639474443597" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  +63 947 444 3597
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground/70">
                <Mail className="w-4 h-4 shrink-0 text-primary/60" />
                <a 
                  href="mailto:info@palawancollective.com"
                  className="hover:text-foreground transition-colors"
                >
                  info@palawancollective.com
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground/70">
                <Globe className="w-4 h-4 shrink-0 text-primary/60" />
                <a 
                  href="https://www.palawancollective.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  www.palawancollective.com
                </a>
              </div>
            </div>
          </div>

          {/* Product Links Column */}
          <div>
            <h4 className="text-foreground text-sm font-medium mb-4">Products</h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-sm text-muted-foreground/70 hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                  >
                    {link.name}
                    {link.href.startsWith("http") && (
                      <ExternalLink className="w-3 h-3" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Integrations Column */}
          <div>
            <h4 className="text-foreground text-sm font-medium mb-4">Integrations</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground/70 mb-2">
                  Integrated with{" "}
                  <a 
                    href="https://www.sirvoy.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary/80 hover:text-primary transition-colors"
                  >
                    Sirvoy
                  </a>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground/50 mb-2">Booking Channels</p>
                <ul className="space-y-1.5">
                  {bookingChannels.map((channel) => (
                    <li key={channel} className="text-sm text-muted-foreground/70">
                      {channel}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-foreground text-sm font-medium mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => setActiveLegal(link.key)}
                    className="text-sm text-muted-foreground/70 hover:text-foreground transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal Modal */}
        <LegalModal open={activeLegal} onClose={() => setActiveLegal(null)} />

        {/* Bottom Bar */}
        <div className="border-t border-border/20 pt-6">
          <p className="text-center text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} Palawan Collective Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
