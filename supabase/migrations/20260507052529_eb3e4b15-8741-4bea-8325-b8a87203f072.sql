-- Create resort_os_cards table for admin-managed cards in the Resort Operating System section
CREATE TABLE public.resort_os_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eyebrow TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  bullets JSONB NOT NULL DEFAULT '[]'::jsonb,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_right BOOLEAN NOT NULL DEFAULT true,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.resort_os_cards ENABLE ROW LEVEL SECURITY;

-- Public read for visible cards (landing page)
CREATE POLICY "Resort OS cards are viewable by everyone"
ON public.resort_os_cards FOR SELECT
USING (true);

-- Admin is gated by client passkey (no auth) — allow anon writes (matches existing products pattern)
CREATE POLICY "Anyone can insert resort_os_cards"
ON public.resort_os_cards FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update resort_os_cards"
ON public.resort_os_cards FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete resort_os_cards"
ON public.resort_os_cards FOR DELETE
USING (true);

CREATE TRIGGER update_resort_os_cards_updated_at
BEFORE UPDATE ON public.resort_os_cards
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Reuse the existing product-images storage bucket for card images (already public)
