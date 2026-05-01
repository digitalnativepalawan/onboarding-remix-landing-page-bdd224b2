import { useState } from "react";
import { Phone, Mail, MessageCircle, Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import LegalModal from "./LegalModal";
import { useTranslation } from "@/contexts/LocaleContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useTheme } from "@/contexts/ThemeContext";

type LegalType = "terms" | "privacy" | "security" | null;

const PRODUCT_LINKS = [
  { name: "BackOffice Resort", url: "https://euro.palawancollective.com" },
  { name: "Palawan Transit", url: "https://palawan-transit.vercel.app" },
  { name: "WildFall", url: "https://wildfallpalawan.vercel.app" },
  { name: "Order Online", url: "https://jaycee.palawancollective.com" },
  { name: "Buy Land", url: "https://land.palawancollective.com" },
];

const RESOURCE_LINKS = [
  { name: "Blog", href: "#blog" },
  { name: "FAQ", href: "#faq" },
  { name: "Feedback", href: "#feedback" },
];

const Footer = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { settings } = useSiteSettings();
  const [activeLegal, setActiveLegal] = useState<LegalType>(null);

  const currentLogo = theme === "dark"
    ? (settings.logo_dark_url || settings.logo_light_url)
    : (settings.logo_light_url || settings.logo_dark_url);

  const legalLinks = [
    { name: t("footer.terms"), key: "terms" as LegalType },
    { name: t("footer.privacy"), key: "privacy" as LegalType },
    { name: t("footer.security"), key: "security" as LegalType },
  ];

  const companyName = settings.company_name || t("footer.brand");
  const tagline = settings.tagline || t("footer.tagline");
  const copyright = settings.copyright_holder || companyName;

  const socials = [
    { url: settings.social_facebook, Icon: Facebook, label: "Facebook" },
    { url: settings.social_instagram, Icon: Instagram, label: "Instagram" },
    { url: settings.social_twitter, Icon: Twitter, label: "X" },
    { url: settings.social_linkedin, Icon: Linkedin, label: "LinkedIn" },
    { url: settings.social_youtube, Icon: Youtube, label: "YouTube" },
  ].filter((s) => s.url);

  return (
    <footer className="border-t border-[#FF4D2E]/30 bg-[#0a0a0a] py-12 md:py-16">
      <div className="page-container">
        {/* Logo */}
        {currentLogo && (
          <div className="mb-8">
            <img src={currentLogo} alt="Logo" className="h-8 w-auto object-contain" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Products */}
          <div>
            <h4 className="text-sm font-medium text-[#F0EDE8] mb-4 font-display">Products</h4>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#888888] hover:text-[#F0EDE8] transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-medium text-[#F0EDE8] mb-4 font-display">Resources</h4>
            <ul className="space-y-2">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-[#888888] hover:text-[#F0EDE8] transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            {/* Contact info */}
            <div className="flex flex-col gap-2 mt-4">
              {settings.contact_phone && (
                <a href={`tel:${settings.contact_phone}`} className="inline-flex items-center gap-2 text-sm text-[#888888] hover:text-[#FF4D2E] transition-colors duration-200">
                  <Phone className="w-3.5 h-3.5" />{settings.contact_phone}
                </a>
              )}
              {settings.contact_whatsapp && (
                <a href={`https://wa.me/${settings.contact_whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[#888888] hover:text-[#FF4D2E] transition-colors duration-200">
                  <MessageCircle className="w-3.5 h-3.5" />{settings.contact_whatsapp}
                </a>
              )}
              {settings.contact_email && (
                <a href={`mailto:${settings.contact_email}`} className="inline-flex items-center gap-2 text-sm text-[#888888] hover:text-[#FF4D2E] transition-colors duration-200">
                  <Mail className="w-3.5 h-3.5" />{settings.contact_email}
                </a>
              )}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-medium text-[#F0EDE8] mb-4 font-display">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.key}>
                  <button
                    onClick={() => setActiveLegal(link.key)}
                    className="text-sm text-[#888888] hover:text-[#FF4D2E] transition-colors duration-200 text-left min-h-[44px] flex items-center"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social icons */}
        {socials.length > 0 && (
          <div className="flex gap-3 mt-8">
            {socials.map(({ url, Icon, label }) => (
              <a
                key={label}
                href={url!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-[#888888] hover:text-[#FF4D2E] transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        )}

        <LegalModal open={activeLegal} onClose={() => setActiveLegal(null)} />

        <div className="border-t border-white/[0.08] pt-6 mt-10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#555555]">© {new Date().getFullYear()} {copyright}</p>
          <p className="text-xs text-[#555555]">Built in Palawan 🌊</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
