-- Create site_settings table for logo URLs and other site-wide settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id text PRIMARY KEY DEFAULT 'default',
  logo_light_url text,
  logo_dark_url text,
  updated_at timestamptz DEFAULT now()
);

-- Insert default row
INSERT INTO public.site_settings (id) VALUES ('default') ON CONFLICT DO NOTHING;

-- Allow public read/write (matches existing table policies in this project)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on site_settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Allow public update on site_settings"
  ON public.site_settings FOR UPDATE
  USING (true);

CREATE POLICY "Allow public insert on site_settings"
  ON public.site_settings FOR INSERT
  WITH CHECK (true);

-- Create logos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access on logos bucket
CREATE POLICY "Allow public read access on logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'logos');

-- Allow public upload to logos bucket
CREATE POLICY "Allow public upload to logos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'logos');

-- Allow public delete from logos bucket
CREATE POLICY "Allow public delete from logos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'logos');

-- Allow public update on logos bucket
CREATE POLICY "Allow public update on logos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'logos');
