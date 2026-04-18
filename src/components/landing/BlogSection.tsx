import { useState, useEffect } from "react";
import { ArrowRight, X, MessageCircle } from "lucide-react";
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
}

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
    <section className="py-16 sm:py-20 px-5 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="section-tag mb-3">From the blog</span>
          <h2 className="section-title mb-2">Digital tools for island businesses</h2>
          <p className="section-subtitle mx-auto">
            Practical guides for resort owners, restaurant operators, transport
            companies, and other businesses building a digital presence in Palawan.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <button
              key={post.id}
              className="glass-card text-left p-5 flex flex-col gap-3 hover:border-primary/20 transition-all duration-200 hover:-translate-y-px cursor-pointer"
              onClick={() => setActivePost(post)}
            >
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium self-start"
                style={{ color: post.tag_color, background: post.tag_bg }}
              >
                {post.tag}
              </span>
              <h3 className="text-sm sm:text-base font-medium text-foreground leading-snug">
                {post.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex-1">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground/60">
                  {new Date(post.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50" />
              </div>
            </button>
          ))}
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
