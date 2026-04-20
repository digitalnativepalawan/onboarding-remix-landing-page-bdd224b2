ALTER TABLE public.media
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'uncategorized',
  ADD COLUMN IF NOT EXISTS folder text,
  ADD COLUMN IF NOT EXISTS source_url text,
  ADD COLUMN IF NOT EXISTS title text;

CREATE INDEX IF NOT EXISTS idx_media_category ON public.media(category);
CREATE INDEX IF NOT EXISTS idx_media_folder ON public.media(folder);