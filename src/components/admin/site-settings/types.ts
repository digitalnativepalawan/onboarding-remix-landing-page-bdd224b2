export interface SiteSettingsRow {
  id: string;
  // Branding URLs
  logo_main_url: string | null;
  logo_light_url: string | null;
  logo_dark_url: string | null;
  favicon_url: string | null;
  // Company
  company_name: string | null;
  tagline: string | null;
  address_line: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  country: string | null;
  copyright_holder: string | null;
  // Contact
  contact_email: string | null;
  contact_phone: string | null;
  contact_whatsapp: string | null;
  // Colors
  color_primary: string | null;
  color_secondary: string | null;
  color_accent: string | null;
  // Social
  social_facebook: string | null;
  social_instagram: string | null;
  social_twitter: string | null;
  social_linkedin: string | null;
  social_youtube: string | null;
  social_tiktok: string | null;
}

export const DEFAULT_COLORS = {
  primary: "#000000",
  secondary: "#FFFFFF",
  accent: "#14b8a6",
};

export const LOGO_FIELDS = [
  { key: "logo_main_url", label: "Main Logo", hint: "Primary brand logo used in headers and hero." },
  { key: "logo_dark_url", label: "Logo for Dark Backgrounds", hint: "White or light variant." },
  { key: "logo_light_url", label: "Logo for Light Backgrounds", hint: "Black or dark variant." },
  { key: "favicon_url", label: "Favicon", hint: "Browser tab icon (32×32 or 64×64 PNG/ICO)." },
] as const;

export type LogoFieldKey = typeof LOGO_FIELDS[number]["key"];
