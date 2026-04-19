CREATE TABLE public.expense_budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL CHECK (year BETWEEN 2020 AND 2100),
  budget_php NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (category, month, year)
);

ALTER TABLE public.expense_budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "open" ON public.expense_budgets FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX idx_expense_budgets_period ON public.expense_budgets (year, month);
CREATE INDEX idx_expense_budgets_category ON public.expense_budgets (category);

CREATE TRIGGER update_expense_budgets_updated_at
BEFORE UPDATE ON public.expense_budgets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();