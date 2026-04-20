import { useState } from "react";
import { Phone, Mail, MessageCircle, Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import LegalModal from "./LegalModal";
import { useTranslation } from "@/contexts/LocaleContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";

type LegalType = "terms" | "privacy" | "security" | null;

const Footer = () => {
  const { t } = useTranslation();
  const { settings } = useSiteSettings();
  const [activeLegal, setActiveLegal] = useState<LegalType>(null);

  const legalLinks = [
    { name: t("footer.terms"), key: "terms" as LegalType },
    { name: t("footer.privacy"), key: "privacy" as LegalType },
    { name: t("footer.security"), key: "security" as LegalType },
  ];

  const channels = ["Booking.com", "Agoda", "Airbnb", "Expedia", "Trip.com", "Direct", "Website", "Booking Engine"];

  const companyName = settings.company_name || t("footer.brand");
  const tagline = settings.tagline || t("footer.tagline");
  const copyright = settings.copyright_holder || companyName;

  const addressParts = [
    settings.address_line,
    [settings.city, settings.province].filter(Boolean).join(", "),
    [settings.postal_code, settings.country].filter(Boolean).join(" "),
  ].filter(Boolean);

  const socials = [
    { url: settings.social_facebook, Icon: Facebook, label: "Facebook" },
    { url: settings.social_instagram, Icon: Instagram, label: "Instagram" },
    { url: settings.social_twitter, Icon: Twitter, label: "X" },
    { url: settings.social_linkedin, Icon: Linkedin, label: "LinkedIn" },
    { url: settings.social_youtube, Icon: Youtube, label: "YouTube" },
  ].filter((s) => s.url);

  const ContactBlock = () => (
    <div className="flex flex-col gap-1.5 text-xs text-foreground/60">
      {settings.contact_phone && (
        <a href={`tel:${settings.contact_phone}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
          <Phone className="w-3 h-3" />{settings.contact_phone}
        </a>
      )}
      {settings.contact_whatsapp && (
        <a href={`https://wa.me/${settings.contact_whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
          <MessageCircle className="w-3 h-3" />{settings.contact_whatsapp}
        </a>
      )}
      {settings.contact_email && (
        <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
          <Mail className="w-3 h-3" />{settings.contact_email}
        </a>
      )}
    </div>
  );

  const BrandBlock = () => (
    <div>
      <h3 className="text-sm font-medium text-foreground mb-2">{companyName}</h3>
      <p className="text-xs text-foreground/70 leading-relaxed mb-3">{tagline}</p>
      {addressParts.length > 0 && (
        <p className="text-[11px] text-foreground/50 leading-relaxed mb-3 whitespace-pre-line">
          {addressParts.join("\n")}
        </p>
      )}
      <ContactBlock />
      {socials.length > 0 && (
        <div className="flex items-center gap-3 mt-3">
          {socials.map(({ url, Icon, label }) => (
            <a key={label} href={url!} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-foreground/50 hover:text-primary transition-colors">
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <footer className="bg-background border-t border-border/20 py-12 md:py-16">
      <div className="px-5 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="sm:hidden space-y-6">
            <BrandBlock />
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-medium text-foreground/90 mb-3">{t("footer.integration")}</h4>
                <p className="text-xs text-foreground/60 mb-2">{t("footer.poweredBy")} <a href="https://www.cloudbeds.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary transition-colors">Cloudbeds</a></p>
                <ul className="space-y-1 text-xs text-foreground/50">{channels.map((ch) => <li key={ch}>{ch}</li>)}</ul>
              </div>
              <div>
                <h4 className="text-xs font-medium text-foreground/90 mb-3">{t("footer.legal")}</h4>
                <ul className="space-y-2">{legalLinks.map((link) => (<li key={link.key}><button onClick={() => setActiveLegal(link.key)} className="text-xs text-foreground/60 hover:text-foreground transition-colors text-left">{link.name}</button></li>))}</ul>
              </div>
            </div>
          </div>

          <div className="hidden sm:grid sm:grid-cols-3 gap-8">
            <BrandBlock />
            <div>
              <h4 className="text-xs font-medium text-foreground/90 mb-3">{t("footer.integration")}</h4>
              <p className="text-xs text-foreground/60 mb-2">{t("footer.poweredBy")} <a href="https://www.cloudbeds.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary transition-colors">Cloudbeds</a></p>
              <ul className="space-y-1 text-xs text-foreground/50">{channels.map((ch) => <li key={ch}>{ch}</li>)}</ul>
            </div>
            <div>
              <h4 className="text-xs font-medium text-foreground/90 mb-3">{t("footer.legal")}</h4>
              <ul className="space-y-2">{legalLinks.map((link) => (<li key={link.key}><button onClick={() => setActiveLegal(link.key)} className="text-xs text-foreground/60 hover:text-foreground transition-colors text-left">{link.name}</button></li>))}</ul>
            </div>
          </div>

          <LegalModal open={activeLegal} onClose={() => setActiveLegal(null)} />
          <div className="border-t border-border/10 mt-8 pt-6 text-center">
            <p className="text-[11px] text-foreground/50">© {new Date().getFullYear()} {copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
