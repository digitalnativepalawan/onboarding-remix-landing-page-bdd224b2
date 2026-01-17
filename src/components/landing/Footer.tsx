import { useState } from "react";
import { Phone, Mail, ExternalLink } from "lucide-react";
import LegalModal from "./LegalModal";
import { useTranslation } from "@/contexts/LocaleContext";

type LegalType = "terms" | "privacy" | "security" | null;

const Footer = () => {
  const { t } = useTranslation();
  const [activeLegal, setActiveLegal] = useState<LegalType>(null);

  const productLinks = [
    { name: "Dashboard", href: "https://host.palawancollective.com/transactions" },
    { name: "Occupancy", href: "https://occupancy.palawancollective.com/" },
    { name: "Timesheet", href: "https://timesheet.palawancollective.com/" },
    { name: "Orders", href: "https://orderonline.palawancollective.com/" },
    { name: "OTR Scan", href: "https://scan.palawancollective.com/" },
  ];

  const legalLinks = [
    { name: t("footer.terms"), key: "terms" as LegalType },
    { name: t("footer.privacy"), key: "privacy" as LegalType },
    { name: t("footer.security"), key: "security" as LegalType },
  ];

  return (
    <footer className="bg-background border-t border-border/20 py-8 sm:py-10">
      <div className="px-5 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="sm:hidden space-y-6">
            <div>
              <h3 className="text-sm font-medium text-white mb-2">{t("footer.brand")}</h3>
              <p className="text-xs text-white/70 leading-relaxed mb-3">{t("footer.tagline")}</p>
              <div className="flex flex-col gap-1.5 text-xs text-white/60">
                <a href="https://wa.me/639474443597" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors"><Phone className="w-3 h-3" />+63 947 444 3597</a>
                <a href="mailto:info@palawancollective.com" className="flex items-center gap-1.5 hover:text-white transition-colors"><Mail className="w-3 h-3" />info@palawancollective.com</a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-medium text-white/90 mb-3">{t("footer.products")}</h4>
                <ul className="space-y-2">{productLinks.map((link) => (<li key={link.name}><a href={link.href} target="_blank" rel="noopener noreferrer" className="text-xs text-white/60 hover:text-white transition-colors inline-flex items-center gap-1">{link.name}<ExternalLink className="w-2.5 h-2.5" /></a></li>))}</ul>
              </div>
              <div>
                <h4 className="text-xs font-medium text-white/90 mb-3">{t("footer.legal")}</h4>
                <ul className="space-y-2">{legalLinks.map((link) => (<li key={link.key}><button onClick={() => setActiveLegal(link.key)} className="text-xs text-white/60 hover:text-white transition-colors text-left">{link.name}</button></li>))}</ul>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-medium text-white/90 mb-3">{t("footer.integration")}</h4>
              <p className="text-xs text-white/60 mb-2">{t("footer.poweredBy")} <a href="https://www.sirvoy.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary transition-colors">Sirvoy</a></p>
              <p className="text-xs text-white/50">Booking.com · Agoda · Airbnb</p>
            </div>
          </div>

          <div className="hidden sm:grid sm:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-medium text-white mb-2">{t("footer.brand")}</h3>
              <p className="text-xs text-white/70 leading-relaxed mb-3">{t("footer.tagline")}</p>
              <div className="flex flex-col gap-1.5 text-xs text-white/60">
                <a href="https://wa.me/639474443597" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors"><Phone className="w-3 h-3" />+63 947 444 3597</a>
                <a href="mailto:info@palawancollective.com" className="flex items-center gap-1.5 hover:text-white transition-colors"><Mail className="w-3 h-3" />info@palawancollective.com</a>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-medium text-white/90 mb-3">{t("footer.products")}</h4>
              <ul className="space-y-2">{productLinks.map((link) => (<li key={link.name}><a href={link.href} target="_blank" rel="noopener noreferrer" className="text-xs text-white/60 hover:text-white transition-colors inline-flex items-center gap-1">{link.name}<ExternalLink className="w-2.5 h-2.5" /></a></li>))}</ul>
            </div>
            <div>
              <h4 className="text-xs font-medium text-white/90 mb-3">{t("footer.integration")}</h4>
              <p className="text-xs text-white/60 mb-2">{t("footer.poweredBy")} <a href="https://www.sirvoy.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary transition-colors">Sirvoy</a></p>
              <ul className="space-y-1 text-xs text-white/50"><li>Booking.com</li><li>Agoda</li><li>Airbnb</li></ul>
            </div>
            <div>
              <h4 className="text-xs font-medium text-white/90 mb-3">{t("footer.legal")}</h4>
              <ul className="space-y-2">{legalLinks.map((link) => (<li key={link.key}><button onClick={() => setActiveLegal(link.key)} className="text-xs text-white/60 hover:text-white transition-colors text-left">{link.name}</button></li>))}</ul>
            </div>
          </div>

          <LegalModal open={activeLegal} onClose={() => setActiveLegal(null)} />
          <div className="border-t border-border/10 mt-8 pt-6 text-center">
            <p className="text-[11px] text-white/50">© {new Date().getFullYear()} Palawan Collective Inc.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
