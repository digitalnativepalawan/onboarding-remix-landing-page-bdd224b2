
CREATE TABLE public.header_link (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.header_link ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Header link is publicly readable"
  ON public.header_link FOR SELECT USING (true);

CREATE POLICY "Header link is publicly writable"
  ON public.header_link FOR ALL USING (true) WITH CHECK (true);
