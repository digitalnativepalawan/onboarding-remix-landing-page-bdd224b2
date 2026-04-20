
-- Pinned column on notes
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS pinned boolean NOT NULL DEFAULT false;

-- project_links
CREATE TABLE IF NOT EXISTS public.project_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  label text NOT NULL,
  url text NOT NULL,
  category text NOT NULL DEFAULT 'other',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.project_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open" ON public.project_links FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_project_links_project ON public.project_links(project_id);

-- project_comments
CREATE TABLE IF NOT EXISTS public.project_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  content text NOT NULL,
  author text NOT NULL DEFAULT 'admin',
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open" ON public.project_comments FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_project_comments_project ON public.project_comments(project_id);
CREATE TRIGGER trg_project_comments_updated BEFORE UPDATE ON public.project_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- project_files
CREATE TABLE IF NOT EXISTS public.project_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  mime_type text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open" ON public.project_files FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_project_files_project ON public.project_files(project_id);

-- Activity log triggers
CREATE OR REPLACE FUNCTION public.log_project_child_activity()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_action text;
  v_label text;
BEGIN
  IF TG_OP = 'INSERT' THEN v_action := 'created';
  ELSIF TG_OP = 'UPDATE' THEN v_action := 'updated';
  ELSE v_action := 'deleted';
  END IF;

  IF TG_TABLE_NAME = 'project_links' THEN
    v_label := 'Link: ' || COALESCE(NEW.label, OLD.label);
  ELSIF TG_TABLE_NAME = 'project_comments' THEN
    v_label := 'Comment';
  ELSIF TG_TABLE_NAME = 'project_files' THEN
    v_label := 'File: ' || COALESCE(NEW.file_name, OLD.file_name);
  ELSIF TG_TABLE_NAME = 'media' THEN
    v_label := 'Image uploaded';
  ELSE
    v_label := TG_TABLE_NAME;
  END IF;

  INSERT INTO public.activity_log (entity_type, entity_id, action, summary)
  VALUES (TG_TABLE_NAME, COALESCE(NEW.project_id, OLD.project_id), v_action, initcap(v_action) || ' ' || v_label);
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_log_project_links ON public.project_links;
CREATE TRIGGER trg_log_project_links AFTER INSERT OR UPDATE OR DELETE ON public.project_links
  FOR EACH ROW EXECUTE FUNCTION public.log_project_child_activity();

DROP TRIGGER IF EXISTS trg_log_project_comments ON public.project_comments;
CREATE TRIGGER trg_log_project_comments AFTER INSERT OR UPDATE OR DELETE ON public.project_comments
  FOR EACH ROW EXECUTE FUNCTION public.log_project_child_activity();

DROP TRIGGER IF EXISTS trg_log_project_files ON public.project_files;
CREATE TRIGGER trg_log_project_files AFTER INSERT OR UPDATE OR DELETE ON public.project_files
  FOR EACH ROW EXECUTE FUNCTION public.log_project_child_activity();

-- Storage bucket for project files
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "project-files read" ON storage.objects FOR SELECT USING (bucket_id = 'project-files');
CREATE POLICY "project-files insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-files');
CREATE POLICY "project-files update" ON storage.objects FOR UPDATE USING (bucket_id = 'project-files');
CREATE POLICY "project-files delete" ON storage.objects FOR DELETE USING (bucket_id = 'project-files');
