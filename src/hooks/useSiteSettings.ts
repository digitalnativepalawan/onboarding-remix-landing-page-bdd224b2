import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { SiteSettingsRow } from "@/components/admin/site-settings/types";

export type SiteSettings = Partial<SiteSettingsRow>;

const DEFAULT_SETTINGS: SiteSettings = {};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "default")
        .maybeSingle();
      if (data) setSettings(data as SiteSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, loading, refetch: fetchSettings };
}
