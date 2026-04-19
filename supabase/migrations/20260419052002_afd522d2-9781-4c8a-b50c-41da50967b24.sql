ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS company_name TEXT,
  ADD COLUMN IF NOT EXISTS tagline TEXT,
  ADD COLUMN IF NOT EXISTS address_line TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS province TEXT,
  ADD COLUMN IF NOT EXISTS postal_code TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS copyright_holder TEXT,
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS contact_whatsapp TEXT,
  ADD COLUMN IF NOT EXISTS logo_main_url TEXT,
  ADD COLUMN IF NOT EXISTS favicon_url TEXT,
  ADD COLUMN IF NOT EXISTS color_primary TEXT,
  ADD COLUMN IF NOT EXISTS color_secondary TEXT,
  ADD COLUMN IF NOT EXISTS color_accent TEXT,
  ADD COLUMN IF NOT EXISTS social_facebook TEXT,
  ADD COLUMN IF NOT EXISTS social_instagram TEXT,
  ADD COLUMN IF NOT EXISTS social_twitter TEXT,
  ADD COLUMN IF NOT EXISTS social_linkedin TEXT,
  ADD COLUMN IF NOT EXISTS social_youtube TEXT,
  ADD COLUMN IF NOT EXISTS social_tiktok TEXT;

INSERT INTO public.site_settings (id, company_name, tagline, address_line, city, province, postal_code, country, copyright_holder, color_primary, color_secondary, color_accent)
VALUES ('default', 'merQato Digitals', 'Smart Solutions for Bold Ambitions', 'San Vicente, Palawan 5309', 'San Vicente', 'Palawan', '5309', 'Philippines', 'merQato Digitals', '#000000', '#FFFFFF', '#14b8a6')
ON CONFLICT (id) DO UPDATE SET
  company_name = COALESCE(public.site_settings.company_name, EXCLUDED.company_name),
  tagline = COALESCE(public.site_settings.tagline, EXCLUDED.tagline),
  address_line = COALESCE(public.site_settings.address_line, EXCLUDED.address_line),
  city = COALESCE(public.site_settings.city, EXCLUDED.city),
  province = COALESCE(public.site_settings.province, EXCLUDED.province),
  postal_code = COALESCE(public.site_settings.postal_code, EXCLUDED.postal_code),
  country = COALESCE(public.site_settings.country, EXCLUDED.country),
  copyright_holder = COALESCE(public.site_settings.copyright_holder, EXCLUDED.copyright_holder),
  color_primary = COALESCE(public.site_settings.color_primary, EXCLUDED.color_primary),
  color_secondary = COALESCE(public.site_settings.color_secondary, EXCLUDED.color_secondary),
  color_accent = COALESCE(public.site_settings.color_accent, EXCLUDED.color_accent);