import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  logo_light_url: string | null;
  logo_dark_url: string | null;
}

const DEFAULT_SETTINGS: SiteSettings = {
  logo_light_url: null,
  logo_dark_url: null,
};

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
      if (data) {
        setSettings({
          logo_light_url: data.logo_light_url,
          logo_dark_url: data.logo_dark_url,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, loading, refetch: fetchSettings };
}
