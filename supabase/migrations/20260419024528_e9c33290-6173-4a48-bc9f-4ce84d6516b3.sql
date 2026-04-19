-- Create logos bucket (correct name) and site_settings table
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do update set public = true;

-- Public read policy
create policy "Public read logos"
  on storage.objects for select
  using (bucket_id = 'logos');

-- Public write/update/delete (admin area is passkey-protected client-side)
create policy "Anyone can upload logos"
  on storage.objects for insert
  with check (bucket_id = 'logos');

create policy "Anyone can update logos"
  on storage.objects for update
  using (bucket_id = 'logos');

create policy "Anyone can delete logos"
  on storage.objects for delete
  using (bucket_id = 'logos');

-- site_settings table (single row keyed by id='default')
create table public.site_settings (
  id text primary key default 'default',
  logo_light_url text,
  logo_dark_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

create policy "Anyone can read site_settings"
  on public.site_settings for select
  using (true);

create policy "Anyone can insert site_settings"
  on public.site_settings for insert
  with check (true);

create policy "Anyone can update site_settings"
  on public.site_settings for update
  using (true);

create trigger update_site_settings_updated_at
before update on public.site_settings
for each row execute function public.update_updated_at_column();

-- Seed the default row
insert into public.site_settings (id) values ('default')
on conflict (id) do nothing;