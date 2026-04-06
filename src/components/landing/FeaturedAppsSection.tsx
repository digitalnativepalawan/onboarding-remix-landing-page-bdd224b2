import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink } from "lucide-react";
import { getIcon } from "@/lib/iconMap";

interface AppLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  display_order: number;
  is_primary: boolean;
}

const FeaturedAppsSection = () => {
  const [links, setLinks] = useState<AppLink[]>([]);

  useEffect(() => {
    const fetchLinks = async () => {
      const { data } = await supabase
        .from("app_links")
        .select("*")
        .order("display_order", { ascending: true })
        .limit(6);
      if (data) setLinks(data);
    };
    fetchLinks();
  }, []);

  if (links.length === 0) return null;

  return (
    <section className="py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {links.map((link) => {
            const IconComponent = getIcon(link.icon);
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all"
              >
                <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{link.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{link.url.replace(/^https?:\/\//, '')}</p>
                </div>
                <ExternalLink className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedAppsSection;
