import { useEffect, useState } from "react";
import heroBg from "@/assets/hero-palawan.jpg";
import { ChevronDown, LayoutDashboard, MapPin, ShoppingCart, ScanLine, Clock, Package, Settings, Home, Users, Calendar, FileText, Database, Globe, Mail, Bell, LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/contexts/LocaleContext";

interface AppLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  display_order: number;
  is_primary: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  MapPin,
  ShoppingCart,
  ScanLine,
  Clock,
  Package,
  Settings,
  Home,
  Users,
  Calendar,
  FileText,
  Database,
  Globe,
  Mail,
  Bell,
};

const HeroSection = () => {
  const { t } = useTranslation();
  const [appLinks, setAppLinks] = useState<AppLink[]>([]);

  useEffect(() => {
    const fetchLinks = async () => {
      const { data } = await supabase
        .from("app_links")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (data) {
        setAppLinks(data);
      }
    };

    fetchLinks();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("app_links_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "app_links" },
        () => {
          fetchLinks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-background/90 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-5 sm:px-6 pt-24 pb-20">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          {/* Primary headline */}
          <h1 className="animate-fade-up opacity-0 text-[1.65rem] sm:text-3xl md:text-4xl font-medium tracking-tight leading-[1.15]" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            {t("hero.headline")}{" "}
            <span className="gradient-text">{t("hero.headlineGradient")}</span>
          </h1>
          
          {/* Supporting sub-headline */}
          <p className="animate-fade-up opacity-0 text-sm sm:text-base text-white/80 leading-relaxed max-w-lg mx-auto" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            {t("hero.subheadline")}
          </p>

          {/* Context badges */}
          <div className="animate-fade-up opacity-0 flex flex-wrap justify-center gap-2" style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/30 text-white/70 text-xs border border-border/20">
              {t("hero.badge1")}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs border border-primary/20">
              {t("hero.badge2")}
            </span>
          </div>

          {/* App features grid */}
          <div className="animate-fade-up opacity-0 pt-4" style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}>
            <p className="text-[0.65rem] text-white/60 uppercase tracking-widest mb-3">{t("hero.yourTools")}</p>
            <div className="flex flex-wrap justify-center gap-2.5 max-w-lg mx-auto">
              {appLinks.map((link) => {
                const IconComponent = iconMap[link.icon] || LayoutDashboard;
                return (
                  <a 
                    key={link.id}
                    href={link.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border transition-all duration-200 w-[calc(50%-5px)] sm:w-auto sm:min-w-[140px] ${
                      link.is_primary 
                        ? 'border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50' 
                        : 'border-border/40 bg-card/40 hover:bg-card/60 hover:border-border/60'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-xs text-white">{link.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#how-it-works" className="text-white/60 hover:text-primary transition-colors">
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
