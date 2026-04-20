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

  return (
    <footer className="bg-[#080809] border-t border-white/5 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-sm font-semibold text-white">{companyName}</h3>
            <p className="text-xs text-[#71717A] mt-1">{tagline}</p>
            {addressParts.length > 0 && (
              <p className="text-sm text-[#A1A1AA] mt-4 whitespace-pre-line leading-relaxed">
                {addressParts.join("\n")}
              </p>
            )}
            <div className="flex flex-col gap-2 mt-4">
              {settings.contact_phone && (
                <a href={`tel:${settings.contact_phone}`} className="inline-flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-burgundy transition-colors">
                  <Phone className="w-3.5 h-3.5" />{settings.contact_phone}
                </a>
              )}
              {settings.contact_whatsapp && (
                <a href={`https://wa.me/${settings.contact_whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-burgundy transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" />{settings.contact_whatsapp}
                </a>
              )}
              {settings.contact_email && (
                <a href={`mailto:${settings.contact_email}`} className="inline-flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-burgundy transition-colors">
                  <Mail className="w-3.5 h-3.5" />{settings.contact_email}
                </a>
              )}
            </div>
            {socials.length > 0 && (
              <div className="flex gap-3 mt-4">
                {socials.map(({ url, Icon, label }) => (
                  <a
                    key={label}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-[#A1A1AA] hover:text-burgundy transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Integration */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">{t("footer.integration")}</h4>
            <p className="text-xs text-[#71717A] mb-3">
              {t("footer.poweredBy")}{" "}
              <a
                href="https://www.cloudbeds.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-burgundy hover:text-burgundy/80 transition-colors"
              >
                Cloudbeds
              </a>
            </p>
            <ul className="space-y-2">
              {channels.map((ch) => (
                <li key={ch} className="text-sm text-[#A1A1AA]">
                  {ch}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.key}>
                  <button
                    onClick={() => setActiveLegal(link.key)}
                    className="text-sm text-[#A1A1AA] hover:text-burgundy transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <LegalModal open={activeLegal} onClose={() => setActiveLegal(null)} />

        <div className="border-t border-white/5 pt-6 mt-10 text-center">
          <p className="text-xs text-[#71717A]">© {new Date().getFullYear()} {copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
