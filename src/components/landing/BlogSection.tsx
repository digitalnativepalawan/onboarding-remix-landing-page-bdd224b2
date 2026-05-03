import { useState, useEffect, useRef } from "react";
import { ArrowRight, X, MessageCircle, Briefcase, Building2, Bus, UtensilsCrossed, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  cta_url: string | null;
  images: { path: string; url: string }[] | null;
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
    gradient: "bg-gradient-to-br from-[#FF4D2E]/20 via-[#FF4D2E]/5 to-transparent",
    pillBg: "bg-[#FF4D2E]/15",
    pillText: "text-[#FF4D2E]",
    pillBorder: "border-[#FF4D2E]/25",
    Icon: Briefcase,
  },
  "Resort ops": {
    gradient: "bg-gradient-to-br from-amber-500/20 via-amber-500/5 to-transparent",
    pillBg: "bg-amber-500/15",
    pillText: "text-amber-400",
    pillBorder: "border-amber-500/25",
    Icon: Building2,
  },
  Transportation: {
    gradient: "bg-gradient-to-br from-sky-500/20 via-sky-500/5 to-transparent",
    pillBg: "bg-sky-500/15",
    pillText: "text-sky-400",
    pillBorder: "border-sky-500/25",
    Icon: Bus,
  },
  "Food & orders": {
    gradient: "bg-gradient-to-br from-orange-500/20 via-orange-500/5 to-transparent",
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
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true });
      if (!error && data) {
        setPosts(data.map((p: any) => ({
          ...p,
          images: Array.isArray(p.images) ? p.images : [],
        })) as BlogPost[]);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("fade-up-visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    const cards = section.querySelectorAll(".fade-up-hidden");
    cards.forEach((card, i) => {
      (card as HTMLElement).style.transitionDelay = `${i * 100}ms`;
      observer.observe(card);
    });
    return () => observer.disconnect();
  }, [loading, posts]);

  if (loading) return null;
  if (posts.length === 0) return null;

  return (
    <section id="blog" ref={sectionRef} className="section-padding">
      <div className="page-container">
        <div className="text-center mb-12 md:mb-16">
          <span className="section-tag">FROM THE BLOG</span>
          <h2 className="mt-3 font-display font-semibold tracking-tight text-[#F0EDE8]">
            Digital tools for island businesses
          </h2>
          <p className="text-base text-[#888888] max-w-2xl mx-auto mt-4">
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
                className="group glass-card-hover overflow-hidden text-left flex flex-col fade-up-hidden"
              >
                <div className={`relative aspect-[16/9] overflow-hidden ${post.image_url ? "" : accent.gradient}`}>
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                    />
                  ) : (
                    <>
                      <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
                          backgroundSize: "16px 16px",
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="w-24 h-24 text-white opacity-[0.08]" />
                      </div>
                    </>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex w-fit items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.15em] font-medium border ${accent.pillBg} ${accent.pillText} ${accent.pillBorder}`}
                    >
                      {post.tag}
                    </span>
                    <span className="text-[10px] text-[#555555]">merQato.digital</span>
                  </div>
                  <h3 className="font-display font-semibold text-[#F0EDE8] mt-4 group-hover:text-[#FF4D2E] transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#888888] mt-2 line-clamp-2 leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-5">
                    <span className="text-xs text-[#555555]">
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#888888] group-hover:translate-x-1 group-hover:text-[#F0EDE8] transition-all duration-200" />
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
          className="fixed inset-0 z-50 bg-[#0a0a0a]/95 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActivePost(null);
          }}
        >
          <div className="min-h-full flex flex-col items-center px-5 sm:px-6 py-10">
            <div className="w-full max-w-2xl flex justify-end mb-6">
              <button
                onClick={() => setActivePost(null)}
                className="p-2 rounded-lg text-[#888888] hover:text-[#F0EDE8] hover:bg-white/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <article className="w-full max-w-2xl space-y-6">
              {(() => {
                const gallery = Array.isArray(activePost.images) ? activePost.images : [];
                const slides = gallery.length > 0
                  ? gallery
                  : activePost.image_url ? [{ path: "cover", url: activePost.image_url }] : [];
                if (slides.length === 0) return null;
                if (slides.length === 1) {
                  return (
                    <img
                      src={slides[0].url}
                      alt={activePost.title}
                      className="w-full rounded-lg object-cover aspect-[16/9]"
                    />
                  );
                }
                return (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {slides.map((s, i) => (
                        <CarouselItem key={s.path + i}>
                          <img
                            src={s.url}
                            alt={`${activePost.title} — ${i + 1}`}
                            loading="lazy"
                            className="w-full rounded-lg object-cover aspect-[16/9]"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2 min-h-[44px] min-w-[44px]" />
                    <CarouselNext className="right-2 min-h-[44px] min-w-[44px]" />
                  </Carousel>
                );
              })()}
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{ color: activePost.tag_color, background: activePost.tag_bg }}
              >
                {activePost.tag}
              </span>
              <h1 className="font-display font-bold text-[#F0EDE8] leading-snug">
                {activePost.title}
              </h1>
              <p className="text-xs text-[#555555]">
                {new Date(activePost.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              {activePost.cta_url && (
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2 bg-[#FF4D2E] hover:bg-[#e64225] text-white border-0 min-h-[44px] rounded-[4px]"
                  onClick={() => window.open(activePost.cta_url!, "_blank", "noopener,noreferrer")}
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit live site
                </Button>
              )}
              <div className="space-y-4">
                {activePost.content.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-sm sm:text-base text-[#888888] leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="pt-4 border-t border-white/[0.08]">
                <p className="text-sm text-[#888888] mb-4">
                  Want to build something like this for your business in Palawan?
                </p>
                <Button
                  size="lg"
                  className="gap-2 bg-[#25D366] hover:bg-[#1fb356] text-white border-0 min-h-[44px] rounded-[4px]"
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
