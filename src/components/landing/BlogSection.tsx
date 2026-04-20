import { useState, useEffect } from "react";
import { ArrowRight, X, MessageCircle, Briefcase, Building2, Bus, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  tag: string;
  tag_color: string;
  tag_bg: string;
  title: string;
  excerpt: string;
  content: string;
  display_order: number;
  published: boolean;
  created_at: string;
  image_url: string | null;
}

type AccentMeta = {
  gradient: string;
  pillBg: string;
  pillText: string;
  pillBorder: string;
  Icon: typeof Briefcase;
};

const ACCENT_MAP: Record<string, AccentMeta> = {
  "Business tips": {
    gradient: "bg-gradient-to-br from-burgundy/30 via-burgundy/10 to-transparent",
    pillBg: "bg-burgundy/15",
    pillText: "text-burgundy",
    pillBorder: "border-burgundy/25",
    Icon: Briefcase,
  },
  "Resort ops": {
    gradient: "bg-gradient-to-br from-amber-500/30 via-amber-500/10 to-transparent",
    pillBg: "bg-amber-500/15",
    pillText: "text-amber-400",
    pillBorder: "border-amber-500/25",
    Icon: Building2,
  },
  Transportation: {
    gradient: "bg-gradient-to-br from-sky-500/30 via-sky-500/10 to-transparent",
    pillBg: "bg-sky-500/15",
    pillText: "text-sky-400",
    pillBorder: "border-sky-500/25",
    Icon: Bus,
  },
  "Food & orders": {
    gradient: "bg-gradient-to-br from-orange-500/30 via-orange-500/10 to-transparent",
    pillBg: "bg-orange-500/15",
    pillText: "text-orange-400",
    pillBorder: "border-orange-500/25",
    Icon: UtensilsCrossed,
  },
};

const DEFAULT_ACCENT: AccentMeta = ACCENT_MAP["Business tips"];

const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true });
      if (!error && data) setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) return null;
  if (posts.length === 0) return null;

  return (
    <section className="py-20 md:py-28 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-burgundy">
            FROM THE BLOG
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white mt-3">
            Digital tools for island businesses
          </h2>
          <p className="text-base md:text-lg text-[#A1A1AA] max-w-2xl mx-auto mt-4">
            Practical guides for resort owners, restaurant operators, transport
            companies, and other businesses building a digital presence in Palawan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => {
            const accent = ACCENT_MAP[post.tag] ?? DEFAULT_ACCENT;
            const { Icon } = accent;
            return (
              <button
                key={post.id}
                onClick={() => setActivePost(post)}
                className="group bg-card border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 hover:-translate-y-1 transition-all duration-300 text-left flex flex-col"
              >
                <div className={`relative aspect-[16/9] rounded-t-2xl overflow-hidden ${post.image_url ? "" : accent.gradient}`}>
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
                          backgroundSize: "16px 16px",
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="w-24 h-24 text-white opacity-[0.12]" />
                      </div>
                    </>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <span
                    className={`inline-flex w-fit items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.15em] font-medium border ${accent.pillBg} ${accent.pillText} ${accent.pillBorder}`}
                  >
                    {post.tag}
                  </span>
                  <h3 className="text-lg md:text-xl font-semibold text-white mt-4 group-hover:text-burgundy transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#A1A1AA] mt-2 line-clamp-2 leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-5">
                    <span className="text-xs text-[#71717A]">
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#A1A1AA] group-hover:translate-x-1 group-hover:text-white transition-all" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {activePost && (
        <div
          className="fixed inset-0 z-50 bg-background/95 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActivePost(null);
          }}
        >
          <div className="min-h-full flex flex-col items-center px-5 sm:px-6 py-10">
            <div className="w-full max-w-2xl flex justify-end mb-6">
              <button
                onClick={() => setActivePost(null)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <article className="w-full max-w-2xl space-y-6">
              {activePost.image_url && (
                <img
                  src={activePost.image_url}
                  alt={activePost.title}
                  className="w-full rounded-xl object-cover aspect-[16/9]"
                />
              )}
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{ color: activePost.tag_color, background: activePost.tag_bg }}
              >
                {activePost.tag}
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-foreground leading-snug">
                {activePost.title}
              </h1>
              <p className="text-xs text-muted-foreground/60">
                {new Date(activePost.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <div className="space-y-4">
                {activePost.content.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-sm sm:text-base text-foreground/80 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="pt-4 border-t border-border/40">
                <p className="text-sm text-muted-foreground mb-4">
                  Want to build something like this for your business in Palawan?
                </p>
                <Button
                  size="lg"
                  className="gap-2 bg-[#25D366] hover:bg-[#1fb356] text-white border-0"
                  onClick={() => window.open("https://wa.me/639474443597", "_blank")}
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat with us on WhatsApp
                </Button>
              </div>
            </article>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogSection;
