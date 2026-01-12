-- Add language field to FAQs table with default 'en'
ALTER TABLE public.faqs ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'en';

-- Add index for efficient language-based queries
CREATE INDEX IF NOT EXISTS idx_faqs_language ON public.faqs(language);

-- Add composite index for language + display_order queries
CREATE INDEX IF NOT EXISTS idx_faqs_language_order ON public.faqs(language, display_order);