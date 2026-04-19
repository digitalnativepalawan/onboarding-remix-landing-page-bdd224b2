import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Pencil, Trash2, Plus, Check, X,
  HelpCircle, Download, FileText, Eye, EyeOff,
} from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  language: string;
}

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

interface AdminSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TAG_PRESETS = [
  { label: "Business tips", color: "#2dd4bf", bg: "#0f3b33" },
  { label: "Resort ops",    color: "#c9a84c", bg: "#1a1200" },
  { label: "Transportation",color: "#378ADD", bg: "#0c1e36" },
  { label: "Food & orders", color: "#f97316", bg: "#1c0a00" },
  { label: "Real estate",   color: "#4ade80", bg: "#052e16" },
  { label: "Technology",    color: "#818cf8", bg: "#1e1b4b" },
];

const AdminSettingsModal = ({ open, onOpenChange }: AdminSettingsModalProps) => {
  /* ── FAQs ── */
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editFaqForm, setEditFaqForm] = useState({ question: "", answer: "" });
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [newFaqForm, setNewFaqForm] = useState({ question: "", answer: "" });

  /* ── Header link ── */
  const [headerLinkTitle, setHeaderLinkTitle] = useState("");
  const [headerLinkUrl, setHeaderLinkUrl] = useState("");
  const [headerLinkId, setHeaderLinkId] = useState<string | null>(null);

  /* ── Blog ── */
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const emptyBlog = {
    tag: "Business tips",
    tag_color: "#2dd4bf",
    tag_bg: "#0f3b33",
    title: "",
    excerpt: "",
    content: "",
  };
  const [blogForm, setBlogForm] = useState(emptyBlog);

  const [loading, setLoading] = useState(false);

  /* ── Fetch helpers ── */
  const fetchFaqs = async () => {
    const { data } = await supabase.from("faqs").select("*").eq("language", "en").order("display_order", { ascending: true });
    setFaqs(data || []);
  };

  const fetchHeaderLink = async () => {
    const { data } = await supabase.from("header_link").select("*").limit(1).maybeSingle();
    if (data) { setHeaderLinkId(data.id); setHeaderLinkTitle(data.title); setHeaderLinkUrl(data.url); }
    else { setHeaderLinkId(null); setHeaderLinkTitle(""); setHeaderLinkUrl(""); }
  };

  const fetchBlogPosts = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("display_order", { ascending: true });
    setBlogPosts(data || []);
  };

  useEffect(() => {
    if (open) { fetchFaqs(); fetchHeaderLink(); fetchBlogPosts(); }
  }, [open]);

  /* ── FAQ handlers ── */
  const handleEditFaq = (faq: FAQ) => { setEditingFaqId(faq.id); setEditFaqForm({ question: faq.question, answer: faq.answer }); };
  const handleSaveEditFaq = async () => {
    if (!editingFaqId) return;
    setLoading(true);
    const editedFaq = faqs.find((f) => f.id === editingFaqId);
    const { error } = await supabase.from("faqs").update({ question: editFaqForm.question, answer: editFaqForm.answer }).eq("id", editingFaqId);
    if (error) { toast.error("Failed to update FAQ"); setLoading(false); return; }
    setEditingFaqId(null);
    if (editedFaq) {
      try {
        const { data: fnData, error: fnError } = await supabase.functions.invoke("translate-faq", { body: { question: editFaqForm.question, answer: editFaqForm.answer, source_language: "en" } });
        if (!fnError && fnData?.translations) {
          for (const [lang, t] of Object.entries(fnData.translations) as [string, any][]) {
            const { data: existing } = await supabase.from("faqs").select("id").eq("display_order", editedFaq.display_order).eq("language", lang).maybeSingle();
            if (existing) await supabase.from("faqs").update({ question: t.question, answer: t.answer }).eq("id", existing.id);
            else await supabase.from("faqs").insert({ question: t.question, answer: t.answer, language: lang, display_order: editedFaq.display_order });
          }
          toast.success("FAQ updated & translations synced ✨");
        } else toast.success("FAQ updated");
      } catch { toast.success("FAQ updated"); }
    }
    fetchFaqs(); setLoading(false);
  };
  const handleDeleteFaq = async (faq: FAQ) => {
    setLoading(true);
    const { error } = await supabase.from("faqs").delete().eq("display_order", faq.display_order);
    if (error) toast.error("Failed to delete FAQ"); else { toast.success("FAQ deleted"); fetchFaqs(); }
    setLoading(false);
  };
  const handleAddFaq = async () => {
    if (!newFaqForm.question || !newFaqForm.answer) { toast.error("Question and answer are required"); return; }
    setLoading(true);
    const maxOrder = faqs.length > 0 ? Math.max(...faqs.map((f) => f.display_order)) : 0;
    const newOrder = maxOrder + 1;
    const { error } = await supabase.from("faqs").insert({ question: newFaqForm.question, answer: newFaqForm.answer, language: "en", display_order: newOrder });
    if (error) { toast.error("Failed to add FAQ"); setLoading(false); return; }
    try {
      const { data: fnData, error: fnError } = await supabase.functions.invoke("translate-faq", { body: { question: newFaqForm.question, answer: newFaqForm.answer, source_language: "en" } });
      if (!fnError && fnData?.translations) {
        const inserts = Object.entries(fnData.translations).map(([lang, t]: [string, any]) => ({ question: t.question, answer: t.answer, language: lang, display_order: newOrder }));
        if (inserts.length > 0) await supabase.from("faqs").insert(inserts);
        toast.success("FAQ added & translated ✨");
      } else toast.success("FAQ added");
    } catch { toast.success("FAQ added"); }
    setNewFaqForm({ question: "", answer: "" }); setIsAddingFaq(false); fetchFaqs(); setLoading(false);
  };

  /* ── Header link handlers ── */
  const handleSaveHeaderLink = async () => {
    if (!headerLinkTitle || !headerLinkUrl) { toast.error("Title and URL are required"); return; }
    setLoading(true);
    if (headerLinkId) {
      const { error } = await supabase.from("header_link").update({ title: headerLinkTitle, url: headerLinkUrl }).eq("id", headerLinkId);
      if (error) toast.error("Failed to update"); else toast.success("Header link updated");
    } else {
      const { error } = await supabase.from("header_link").insert({ title: headerLinkTitle, url: headerLinkUrl });
      if (error) toast.error("Failed to save"); else toast.success("Header link saved");
    }
    await fetchHeaderLink(); setLoading(false);
  };
  const handleDeleteHeaderLink = async () => {
    if (!headerLinkId) return;
    setLoading(true);
    await supabase.from("header_link").delete().eq("id", headerLinkId);
    setHeaderLinkId(null); setHeaderLinkTitle(""); setHeaderLinkUrl(""); toast.success("Header link removed"); setLoading(false);
  };

  /* ── Blog handlers ── */
  const applyTagPreset = (preset: typeof TAG_PRESETS[0]) => {
    setBlogForm((f) => ({ ...f, tag: preset.label, tag_color: preset.color, tag_bg: preset.bg }));
  };

  const handleStartEditBlog = (post: BlogPost) => {
    setEditingBlogId(post.id);
    setIsAddingBlog(false);
    setBlogForm({
      tag: post.tag, tag_color: post.tag_color, tag_bg: post.tag_bg,
      title: post.title, excerpt: post.excerpt, content: post.content,
    });
  };

  const handleSaveBlog = async () => {
    if (!blogForm.title || !blogForm.excerpt || !blogForm.content) { toast.error("Title, excerpt and content are required"); return; }
    setLoading(true);
    if (editingBlogId) {
      const { error } = await supabase.from("blog_posts").update({ tag: blogForm.tag, tag_color: blogForm.tag_color, tag_bg: blogForm.tag_bg, title: blogForm.title, excerpt: blogForm.excerpt, content: blogForm.content }).eq("id", editingBlogId);
      if (error) toast.error("Failed to update post"); else { toast.success("Post updated"); setEditingBlogId(null); setBlogForm(emptyBlog); fetchBlogPosts(); }
    } else {
      const maxOrder = blogPosts.length > 0 ? Math.max(...blogPosts.map((p) => p.display_order)) : 0;
      const { error } = await supabase.from("blog_posts").insert({ ...blogForm, display_order: maxOrder + 1, published: true });
      if (error) toast.error("Failed to add post"); else { toast.success("Post published ✨"); setIsAddingBlog(false); setBlogForm(emptyBlog); fetchBlogPosts(); }
    }
    setLoading(false);
  };

  const handleTogglePublished = async (post: BlogPost) => {
    setLoading(true);
    const { error } = await supabase.from("blog_posts").update({ published: !post.published }).eq("id", post.id);
    if (error) toast.error("Failed to update"); else { toast.success(post.published ? "Post unpublished" : "Post published"); fetchBlogPosts(); }
    setLoading(false);
  };

  const handleDeleteBlog = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) toast.error("Failed to delete post"); else { toast.success("Post deleted"); fetchBlogPosts(); }
    setLoading(false);
  };

  const handleCancelBlog = () => {
    setEditingBlogId(null); setIsAddingBlog(false); setBlogForm(emptyBlog);
  };

  /* ── Blog form shared UI ── */
  const BlogForm = () => (
    <div className="space-y-3 p-3 rounded-lg border border-primary/30 bg-primary/5">
      <div>
        <Label className="text-xs">Tag preset</Label>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {TAG_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyTagPreset(p)}
              className="px-2 py-0.5 rounded-full text-xs font-medium border transition-all"
              style={{
                background: blogForm.tag === p.label ? p.bg : "transparent",
                color: p.color,
                borderColor: p.color + "40",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label className="text-xs">Title</Label>
        <Input placeholder="Post title" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} />
      </div>
      <div>
        <Label className="text-xs">Excerpt (shown on card)</Label>
        <Textarea placeholder="Short summary shown on the blog card" value={blogForm.excerpt} onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })} rows={2} />
      </div>
      <div>
        <Label className="text-xs">Content (separate paragraphs with a blank line)</Label>
        <Textarea placeholder="Write your post here...&#10;&#10;Start a new paragraph by leaving a blank line between them." value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} rows={10} className="font-mono text-xs" />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSaveBlog} disabled={loading}>
          <Check className="w-3 h-3 mr-1" /> {editingBlogId ? "Save Changes" : "Publish Post"}
        </Button>
        <Button size="sm" variant="ghost" onClick={handleCancelBlog}>
          <X className="w-3 h-3 mr-1" /> Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admin Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="blog" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="blog" className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />Blog
            </TabsTrigger>
            <TabsTrigger value="faqs" className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />FAQs
            </TabsTrigger>
            <TabsTrigger value="header" className="flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />Header
            </TabsTrigger>
          </TabsList>

          {/* ── BLOG TAB ── */}
          <TabsContent value="blog" className="space-y-3 mt-4">
            <p className="text-xs text-muted-foreground pb-2 border-b border-border/30">
              Add, edit, hide, or delete blog posts. Posts appear on the public site instantly.
            </p>

            {blogPosts.map((post) => (
              <div key={post.id} className="rounded-lg border border-border/50 bg-card/50 overflow-hidden">
                {editingBlogId === post.id ? (
                  <div className="p-3"><BlogForm /></div>
                ) : (
                  <div className="flex items-start gap-2 p-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{ background: post.tag_bg, color: post.tag_color }}
                        >
                          {post.tag}
                        </span>
                        {!post.published && (
                          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium truncate">{post.title}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{post.excerpt}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        title={post.published ? "Unpublish" : "Publish"}
                        onClick={() => handleTogglePublished(post)}
                        disabled={loading}
                      >
                        {post.published ? <Eye className="w-3.5 h-3.5 text-primary" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleStartEditBlog(post)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="icon" variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteBlog(post.id)}
                        disabled={loading}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isAddingBlog ? (
              <BlogForm />
            ) : (
              <Button variant="outline" className="w-full" onClick={() => { setIsAddingBlog(true); setEditingBlogId(null); setBlogForm(emptyBlog); }}>
                <Plus className="w-4 h-4 mr-2" /> Write New Post
              </Button>
            )}
          </TabsContent>

          {/* ── FAQS TAB ── */}
          <TabsContent value="faqs" className="space-y-3 mt-4">
            <p className="text-xs text-muted-foreground pb-2 border-b border-border/30">
              Manage FAQs in English. Translations are handled automatically.
            </p>
            {faqs.map((faq, index) => (
              <div key={faq.id} className="flex items-start gap-2 p-3 rounded-lg border border-border/50 bg-card/50">
                <span className="text-xs text-muted-foreground pt-1 w-5 shrink-0">{index + 1}.</span>
                {editingFaqId === faq.id ? (
                  <div className="flex-1 space-y-2">
                    <div><Label className="text-xs">Question</Label><Input placeholder="Question" value={editFaqForm.question} onChange={(e) => setEditFaqForm({ ...editFaqForm, question: e.target.value })} /></div>
                    <div><Label className="text-xs">Answer</Label><Textarea placeholder="Answer" value={editFaqForm.answer} onChange={(e) => setEditFaqForm({ ...editFaqForm, answer: e.target.value })} rows={8} className="whitespace-pre-wrap" /></div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEditFaq} disabled={loading}><Check className="w-3 h-3 mr-1" /> Save & Translate</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingFaqId(null)}><X className="w-3 h-3 mr-1" /> Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium mb-1">{faq.question}</p>
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">{faq.answer}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="icon" variant="ghost" onClick={() => handleEditFaq(faq)}><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDeleteFaq(faq)} disabled={loading}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {isAddingFaq ? (
              <div className="p-3 rounded-lg border border-primary/30 bg-primary/5 space-y-2">
                <Label className="text-xs font-medium">Add New FAQ</Label>
                <div><Label className="text-xs">Question</Label><Input placeholder="Enter the question" value={newFaqForm.question} onChange={(e) => setNewFaqForm({ ...newFaqForm, question: e.target.value })} /></div>
                <div><Label className="text-xs">Answer</Label><Textarea placeholder="Enter the answer" value={newFaqForm.answer} onChange={(e) => setNewFaqForm({ ...newFaqForm, answer: e.target.value })} rows={8} className="whitespace-pre-wrap" /></div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddFaq} disabled={loading}><Plus className="w-3 h-3 mr-1" /> Add</Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsAddingFaq(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => setIsAddingFaq(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add New FAQ
              </Button>
            )}
          </TabsContent>

          {/* ── HEADER LINK TAB ── */}
          <TabsContent value="header" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">Configure a download link or URL that appears in the header bar.</p>
            <div className="space-y-3 p-4 rounded-lg border border-border/50 bg-card/50">
              <div className="space-y-2"><Label htmlFor="header-title" className="text-xs">Title</Label><Input id="header-title" placeholder="e.g. Staff Manual, Menu PDF" value={headerLinkTitle} onChange={(e) => setHeaderLinkTitle(e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="header-url" className="text-xs">URL</Label><Input id="header-url" placeholder="https://example.com/file.pdf" value={headerLinkUrl} onChange={(e) => setHeaderLinkUrl(e.target.value)} /></div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveHeaderLink} disabled={loading}><Check className="w-3 h-3 mr-1" /> {headerLinkId ? "Update" : "Save"}</Button>
                {headerLinkId && <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={handleDeleteHeaderLink} disabled={loading}><Trash2 className="w-3 h-3 mr-1" /> Remove</Button>}
              </div>
            </div>
            {headerLinkId && (
              <div className="p-3 rounded-lg bg-muted/50 border border-border/30">
                <p className="text-xs text-muted-foreground">✅ Active — "<span className="text-foreground font-medium">{headerLinkTitle}</span>" is visible in the header.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSettingsModal;
