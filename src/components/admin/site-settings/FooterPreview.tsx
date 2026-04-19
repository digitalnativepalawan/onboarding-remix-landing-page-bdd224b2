import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import type { SiteSettingsRow } from "./types";

interface FooterPreviewProps {
  s: SiteSettingsRow;
}

const socials = (s: SiteSettingsRow) =>
  [
    { url: s.social_facebook, Icon: Facebook, label: "Facebook" },
    { url: s.social_instagram, Icon: Instagram, label: "Instagram" },
    { url: s.social_twitter, Icon: Twitter, label: "X" },
    { url: s.social_linkedin, Icon: Linkedin, label: "LinkedIn" },
    { url: s.social_youtube, Icon: Youtube, label: "YouTube" },
  ].filter((x) => x.url);

export default function FooterPreview({ s }: FooterPreviewProps) {
  const [dark, setDark] = useState(true);
  const year = new Date().getFullYear();
  const logo = dark ? s.logo_dark_url || s.logo_main_url : s.logo_light_url || s.logo_main_url;
  const links = socials(s);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Footer Preview</h3>
        <Button size="sm" variant="outline" onClick={() => setDark((d) => !d)} className="h-7 text-xs">
          {dark ? <Sun className="w-3 h-3 mr-1" /> : <Moon className="w-3 h-3 mr-1" />}
          {dark ? "Light preview" : "Dark preview"}
        </Button>
      </div>

      <div
        className={`rounded-lg border overflow-hidden ${
          dark ? "bg-zinc-950 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"
        }`}
      >
        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2 min-w-0">
              {logo ? (
                <img src={logo} alt={s.company_name || "Logo"} className="h-10 object-contain" />
              ) : (
                <div className={`text-base font-semibold ${dark ? "text-white" : "text-black"}`}>
                  {s.company_name || "Company"}
                </div>
              )}
              {s.tagline && (
                <p className={`text-xs ${dark ? "text-zinc-400" : "text-zinc-600"}`}>{s.tagline}</p>
              )}
              <div className={`text-xs space-y-0.5 ${dark ? "text-zinc-400" : "text-zinc-600"}`}>
                {s.address_line && <p>{s.address_line}</p>}
                {(s.city || s.province || s.postal_code) && (
                  <p>
                    {[s.city, s.province, s.postal_code].filter(Boolean).join(", ")}
                  </p>
                )}
                {s.country && <p>{s.country}</p>}
              </div>
            </div>

            <div className={`text-xs space-y-1 ${dark ? "text-zinc-400" : "text-zinc-600"}`}>
              {s.contact_phone && (
                <a href={`tel:${s.contact_phone}`} className="flex items-center gap-1.5 hover:underline">
                  <Phone className="w-3 h-3" /> {s.contact_phone}
                </a>
              )}
              {s.contact_email && (
                <a href={`mailto:${s.contact_email}`} className="flex items-center gap-1.5 hover:underline">
                  <Mail className="w-3 h-3" /> {s.contact_email}
                </a>
              )}
            </div>
          </div>

          {links.length > 0 && (
            <div className="flex items-center gap-3">
              {links.map(({ url, Icon, label }) => (
                <a
                  key={label}
                  href={url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`p-1.5 rounded-md transition-colors ${
                    dark ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-zinc-100 text-zinc-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          )}

          <div
            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-3 border-t text-[11px] ${
              dark ? "border-zinc-800 text-zinc-500" : "border-zinc-200 text-zinc-500"
            }`}
          >
            <p>© {year} {s.copyright_holder || s.company_name || "Company"}. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
