-- Add client_id to projects (nullable, links project to a client)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL;

-- Create work_logs table for billable work entries
CREATE TABLE IF NOT EXISTS public.work_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  quote_id uuid REFERENCES public.quotes(id) ON DELETE SET NULL,
  quote_item_id uuid REFERENCES public.quote_items(id) ON DELETE SET NULL,
  description text NOT NULL,
  hours numeric,
  qty numeric NOT NULL DEFAULT 1,
  unit_price_php numeric NOT NULL DEFAULT 0,
  line_total_php numeric GENERATED ALWAYS AS (qty * unit_price_php) STORED,
  logged_on date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.work_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "open" ON public.work_logs FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_work_logs_project ON public.work_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_work_logs_quote ON public.work_logs(quote_id);