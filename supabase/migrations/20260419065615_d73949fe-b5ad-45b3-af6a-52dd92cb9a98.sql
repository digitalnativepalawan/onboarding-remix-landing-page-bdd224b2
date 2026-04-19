-- Expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Info
  expense_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'PHP',
  amount_php NUMERIC,

  -- Dates
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  -- Payment
  payment_method TEXT,
  payment_reference TEXT,

  -- Receipt
  receipt_path TEXT,
  receipt_url TEXT,

  -- Classification
  expense_type TEXT DEFAULT 'one_time',
  is_billable BOOLEAN DEFAULT FALSE,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_frequency TEXT,
  next_recurring_date DATE,

  -- Linking
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES public.quotes(id) ON DELETE SET NULL,

  -- Approval
  status TEXT DEFAULT 'approved',
  approved_by TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  vendor_name TEXT,
  invoice_number TEXT
);

CREATE INDEX idx_expenses_category ON public.expenses(category);
CREATE INDEX idx_expenses_date ON public.expenses(expense_date);
CREATE INDEX idx_expenses_currency ON public.expenses(currency);
CREATE INDEX idx_expenses_billable ON public.expenses(is_billable);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "open" ON public.expenses
  FOR ALL USING (true) WITH CHECK (true);

-- updated_at trigger
CREATE TRIGGER set_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- activity log
CREATE TRIGGER log_expenses_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.log_activity();

-- Receipts storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read receipts"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'receipts');

CREATE POLICY "Public upload receipts"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'receipts');

CREATE POLICY "Public update receipts"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'receipts');

CREATE POLICY "Public delete receipts"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'receipts');