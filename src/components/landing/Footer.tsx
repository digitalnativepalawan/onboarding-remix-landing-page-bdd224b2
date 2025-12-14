import { useState } from "react";
import { MapPin, Phone, Mail, Globe, ExternalLink } from "lucide-react";
import LegalModal from "./LegalModal";

type LegalType = "terms" | "privacy" | "security" | null;

const Footer = () => {
  const [activeLegal, setActiveLegal] = useState<LegalType>(null);

  const productLinks = [
    { name: "Dashboard", href: "https://host.palawancollective.com/transactions" },
    { name: "Occupancy", href: "https://occupancy.palawancollective.com/" },
    { name: "Timesheet", href: "https://timesheet.palawancollective.com/" },
    { name: "Orders", href: "https://orderonline.palawancollective.com/" },
    { name: "OTR Scan", href: "https://scan.palawancollective.com/" },
  ];

  const legalLinks = [
    { name: "Terms", key: "terms" as LegalType },
    { name: "Privacy", key: "privacy" as LegalType },
    { name: "Security", key: "security" as LegalType },
  ];

  return (
    <footer className="bg-background border-t border-border/20 py-8 sm:py-10">
      <div className="px-5 sm:px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Mobile Layout */}
          <div className="sm:hidden space-y-6">
            {/* Brand */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Palawan Collective</h3>
              <p className="text-xs text-muted-foreground/60 leading-relaxed mb-3">
                Resort operations software for Palawan
              </p>
              <div className="flex flex-col gap-1.5 text-xs text-muted-foreground/50">
                <a 
                  href="https://wa.me/639474443597" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-foreground/70 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  +63 947 444 3597
                </a>
                <a 
                  href="mailto:info@palawancollective.com"
                  className="flex items-center gap-1.5 hover:text-foreground/70 transition-colors"
                >
                  <Mail className="w-3 h-3" />
                  info@palawancollective.com
                </a>
              </div>
            </div>

            {/* Products + Legal: 2-column grid */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-medium text-foreground/80 mb-3">Products</h4>
                <ul className="space-y-2">
                  {productLinks.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground/50 hover:text-foreground/70 transition-colors inline-flex items-center gap-1"
                      >
                        {link.name}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-medium text-foreground/80 mb-3">Legal</h4>
                <ul className="space-y-2">
                  {legalLinks.map((link) => (
                    <li key={link.name}>
                      <button
                        onClick={() => setActiveLegal(link.key)}
                        className="text-xs text-muted-foreground/50 hover:text-foreground/70 transition-colors text-left"
                      >
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Integration */}
            <div>
              <h4 className="text-xs font-medium text-foreground/80 mb-3">Integration</h4>
              <p className="text-xs text-muted-foreground/50 mb-2">
                Powered by{" "}
                <a 
                  href="https://www.sirvoy.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary/70 hover:text-primary transition-colors"
                >
                  Sirvoy
                </a>
              </p>
              <p className="text-xs text-muted-foreground/40">
                Booking.com · Agoda · Airbnb
              </p>
            </div>
          </div>

          {/* Tablet & Desktop Layout */}
          <div className="hidden sm:grid sm:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Palawan Collective</h3>
              <p className="text-xs text-muted-foreground/60 leading-relaxed mb-3">
                Resort operations software for Palawan
              </p>
              <div className="flex flex-col gap-1.5 text-xs text-muted-foreground/50">
                <a 
                  href="https://wa.me/639474443597" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-foreground/70 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  +63 947 444 3597
                </a>
                <a 
                  href="mailto:info@palawancollective.com"
                  className="flex items-center gap-1.5 hover:text-foreground/70 transition-colors"
                >
                  <Mail className="w-3 h-3" />
                  info@palawancollective.com
                </a>
              </div>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-xs font-medium text-foreground/80 mb-3">Products</h4>
              <ul className="space-y-2">
                {productLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground/50 hover:text-foreground/70 transition-colors inline-flex items-center gap-1"
                    >
                      {link.name}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Integration */}
            <div>
              <h4 className="text-xs font-medium text-foreground/80 mb-3">Integration</h4>
              <p className="text-xs text-muted-foreground/50 mb-2">
                Powered by{" "}
                <a 
                  href="https://www.sirvoy.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary/70 hover:text-primary transition-colors"
                >
                  Sirvoy
                </a>
              </p>
              <ul className="space-y-1 text-xs text-muted-foreground/40">
                <li>Booking.com</li>
                <li>Agoda</li>
                <li>Airbnb</li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-medium text-foreground/80 mb-3">Legal</h4>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => setActiveLegal(link.key)}
                      className="text-xs text-muted-foreground/50 hover:text-foreground/70 transition-colors text-left"
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

          {/* Copyright */}
          <div className="border-t border-border/10 mt-8 pt-6 text-center">
            <p className="text-[11px] text-muted-foreground/40">
              © {new Date().getFullYear()} Palawan Collective Inc.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
