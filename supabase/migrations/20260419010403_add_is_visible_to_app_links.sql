-- Add is_visible column to app_links table for admin toggle control
ALTER TABLE public.app_links
  ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true;
