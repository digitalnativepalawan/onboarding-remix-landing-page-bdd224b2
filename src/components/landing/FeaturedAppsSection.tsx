import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink } from "lucide-react";

interface AppLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  display_order: number;
  is_primary: boolean;
}

interface FeaturedAppsSectionProps {
  variant?: "section" | "inline";
}

const FeaturedAppsSection = ({ variant = "section" }: FeaturedAppsSectionProps) => {
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

  const content = (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-sm sm:text-base font-semibold text-center mb-3 tracking-tight">
        Featured WebApps
      </h2>
      <div className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden divide-y divide-border/40">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-4 py-3 hover:bg-accent/40 transition-colors text-left"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{link.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {link.url.replace(/^https?:\/\//, "")}
              </p>
            </div>
            <ExternalLink className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );

  if (variant === "inline") return content;

  return <section className="py-8 px-4 sm:px-6">{content}</section>;
};

export default FeaturedAppsSection;
