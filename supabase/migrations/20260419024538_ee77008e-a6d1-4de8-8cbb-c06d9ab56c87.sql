alter table public.app_links
  add column if not exists is_visible boolean not null default true;