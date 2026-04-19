
-- =========================================================
-- PHASE 0: Command center schema
-- =========================================================

-- ---------- PROJECTS ----------
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  stage TEXT NOT NULL DEFAULT 'idea' CHECK (stage IN ('idea','research','development','testing','live','monetized')),
  github_url TEXT,
  lovable_url TEXT,
  vercel_url TEXT,
  live_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  team_members TEXT[] DEFAULT '{}',
  start_date DATE,
  target_launch DATE,
  actual_launch DATE,
  budget_php NUMERIC DEFAULT 0,
  actual_cost_php NUMERIC DEFAULT 0,
  screenshots TEXT[] DEFAULT '{}',
  notes TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open" ON public.projects FOR ALL USING (true) WITH CHECK (true);

-- ---------- CLIENTS ----------
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  contact_name TEXT,
  whatsapp TEXT,
  email TEXT,
  location TEXT,
  facebook_url TEXT,
  business_type TEXT,
  source TEXT CHECK (source IN ('referral','facebook','google','walk-in')),
  pipeline_stage TEXT NOT NULL DEFAULT 'prospect' CHECK (pipeline_stage IN ('prospect','contacted','demo','negotiating','closed','active')),
  service_interests TEXT[] DEFAULT '{}',
  estimated_value_php NUMERIC DEFAULT 0,
  monthly_recurring_php NUMERIC DEFAULT 0,
  last_contact_date DATE,
  follow_up_date DATE,
  pitch_sent_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open" ON public.clients FOR ALL USING (true) WITH CHECK (true);

-- ---------- CLIENT NOTES ----------
CREATE TABLE public.client_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.client_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open" ON public.client_notes FOR ALL USING (true) WITH CHECK (true);

-- ---------- CATALOG ITEMS ----------
CREATE TABLE public.catalog_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  base_price_php NUMERIC DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',
  setup_days INT DEFAULT 7,
  demo_url TEXT,
  screenshots TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open" ON public.catalog_items FOR ALL USING (true) WITH CHECK (true);

-- ---------- QUOTES ----------
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','negotiated','accepted','rejected','expired')),
  notes TEXT,
  terms TEXT,
  total_php NUMERIC DEFAULT 0,
  valid_until DATE,
  sent_via TEXT CHECK (sent_via IN ('email','whatsapp','in-person')),
  follow_up_count INT NOT NULL DEFAULT 0,
  last_reminder_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open" ON public.quotes FOR ALL USING (true) WITH CHECK (true);

-- ---------- QUOTE ITEMS ----------
CREATE TABLE public.quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  catalog_item_id UUID REFERENCES public.catalog_items(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  qty NUMERIC NOT NULL DEFAULT 1,
  unit_price_php NUMERIC NOT NULL DEFAULT 0,
  line_total_php NUMERIC NOT NULL DEFAULT 0,
  sort_order INT DEFAULT 0
);
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open" ON public.quote_items FOR ALL USING (true) WITH CHECK (true);

-- ---------- TOOLS ----------
CREATE TABLE public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  github_url TEXT,
  description TEXT,
  license TEXT,
  installed BOOLEAN NOT NULL DEFAULT false,
  installed_at DATE,
  token_burn TEXT CHECK (token_burn IN ('low','medium','high','negative')),
  monthly_cost_usd NUMERIC DEFAULT 0,
  revenue_potential_php NUMERIC DEFAULT 0,
  priority_rank INT DEFAULT 99,
  use_cases TEXT[] DEFAULT '{}',
  install_instructions TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open" ON public.tools FOR ALL USING (true) WITH CHECK (true);

-- ---------- NOTES ----------
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  type TEXT NOT NULL DEFAULT 'idea' CHECK (type IN ('idea','todo','meeting','client','bug','feature')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  due_date DATE,
  completed BOOLEAN NOT NULL DEFAULT false,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  tool_id UUID REFERENCES public.tools(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open" ON public.notes FOR ALL USING (true) WITH CHECK (true);

-- ---------- MEDIA ----------
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  alt_text TEXT,
  media_type TEXT CHECK (media_type IN ('screenshot','mockup','diagram','logo','photo')),
  device_type TEXT CHECK (device_type IN ('desktop','mobile','tablet','all')),
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  tool_id UUID REFERENCES public.tools(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  size_bytes BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open" ON public.media FOR ALL USING (true) WITH CHECK (true);

-- ---------- REVENUE ----------
CREATE TABLE public.revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  amount_php NUMERIC NOT NULL DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'setup' CHECK (type IN ('setup','monthly','commission')),
  payment_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','overdue')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.revenue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open" ON public.revenue FOR ALL USING (true) WITH CHECK (true);

-- ---------- WEEKLY GOALS ----------
CREATE TABLE public.weekly_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  target_value INT NOT NULL DEFAULT 1,
  current_value INT NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  week_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.weekly_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open" ON public.weekly_goals FOR ALL USING (true) WITH CHECK (true);

-- ---------- ACTIVITY LOG ----------
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL CHECK (action IN ('created','updated','deleted','status_changed')),
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open" ON public.activity_log FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX idx_activity_log_created_at ON public.activity_log (created_at DESC);

-- ---------- updated_at TRIGGERS ----------
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_quotes_updated BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_notes_updated BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_weekly_goals_updated BEFORE UPDATE ON public.weekly_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- ACTIVITY LOG TRIGGER FUNCTION ----------
CREATE OR REPLACE FUNCTION public.log_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_summary TEXT;
  v_action TEXT;
  v_label TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'created';
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'updated';
  ELSE
    v_action := 'deleted';
  END IF;

  IF TG_TABLE_NAME = 'projects' THEN
    v_label := COALESCE(NEW.name, OLD.name);
  ELSIF TG_TABLE_NAME = 'clients' THEN
    v_label := COALESCE(NEW.business_name, OLD.business_name);
  ELSIF TG_TABLE_NAME = 'quotes' THEN
    v_label := COALESCE(NEW.title, OLD.title);
  ELSIF TG_TABLE_NAME = 'revenue' THEN
    v_label := 'Revenue ₱' || COALESCE(NEW.amount_php::text, OLD.amount_php::text);
  ELSIF TG_TABLE_NAME = 'notes' THEN
    v_label := COALESCE(NEW.title, OLD.title);
  ELSE
    v_label := TG_TABLE_NAME;
  END IF;

  v_summary := initcap(v_action) || ' ' || TG_TABLE_NAME || ': ' || v_label;

  INSERT INTO public.activity_log (entity_type, entity_id, action, summary)
  VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    v_action,
    v_summary
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_log_projects AFTER INSERT OR UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.log_activity();
CREATE TRIGGER trg_log_clients  AFTER INSERT OR UPDATE ON public.clients  FOR EACH ROW EXECUTE FUNCTION public.log_activity();
CREATE TRIGGER trg_log_quotes   AFTER INSERT OR UPDATE ON public.quotes   FOR EACH ROW EXECUTE FUNCTION public.log_activity();
CREATE TRIGGER trg_log_revenue  AFTER INSERT OR UPDATE ON public.revenue  FOR EACH ROW EXECUTE FUNCTION public.log_activity();
CREATE TRIGGER trg_log_notes    AFTER INSERT OR UPDATE ON public.notes    FOR EACH ROW EXECUTE FUNCTION public.log_activity();

-- ---------- STORAGE BUCKETS ----------
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) VALUES ('screenshots', 'screenshots', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Anyone upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media');
CREATE POLICY "Anyone update media" ON storage.objects FOR UPDATE USING (bucket_id = 'media');
CREATE POLICY "Anyone delete media" ON storage.objects FOR DELETE USING (bucket_id = 'media');

CREATE POLICY "Public read screenshots" ON storage.objects FOR SELECT USING (bucket_id = 'screenshots');
CREATE POLICY "Anyone upload screenshots" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'screenshots');
CREATE POLICY "Anyone update screenshots" ON storage.objects FOR UPDATE USING (bucket_id = 'screenshots');
CREATE POLICY "Anyone delete screenshots" ON storage.objects FOR DELETE USING (bucket_id = 'screenshots');
