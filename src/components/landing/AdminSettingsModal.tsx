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
import { Pencil, Trash2, Plus, Check, X, Star, Link, HelpCircle, Download, Languages } from "lucide-react";

interface AppLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  display_order: number;
  is_primary: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  language: string;
}

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "tl", label: "Tagalog" },
  { value: "it", label: "Italiano" },
  { value: "de", label: "Deutsch" },
];

interface AdminSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ICON_OPTIONS = [
  "LayoutDashboard",
  "MapPin",
  "ShoppingCart",
  "ScanLine",
  "Clock",
  "Package",
  "Settings",
  "Home",
  "Users",
  "Calendar",
  "FileText",
  "Database",
  "Globe",
  "Mail",
  "Bell",
];

const AdminSettingsModal = ({ open, onOpenChange }: AdminSettingsModalProps) => {
  // App Links state
  const [links, setLinks] = useState<AppLink[]>([]);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editLinkForm, setEditLinkForm] = useState({ name: "", url: "", icon: "", is_primary: false });
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLinkForm, setNewLinkForm] = useState({ name: "", url: "", icon: "LayoutDashboard", is_primary: false });
  
  // FAQ state
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [faqLanguageFilter, setFaqLanguageFilter] = useState("en");
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editFaqForm, setEditFaqForm] = useState({ question: "", answer: "" });
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [newFaqForm, setNewFaqForm] = useState({ question: "", answer: "" });

  // Header link state
  const [headerLinkTitle, setHeaderLinkTitle] = useState("");
  const [headerLinkUrl, setHeaderLinkUrl] = useState("");
  const [headerLinkId, setHeaderLinkId] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);

  const fetchLinks = async () => {
    const { data, error } = await supabase
      .from("app_links")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast.error("Failed to load links");
      return;
    }
    setLinks(data || []);
  };

  const fetchFaqs = async (lang: string) => {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("language", lang)
      .order("display_order", { ascending: true });

    if (error) {
      toast.error("Failed to load FAQs");
      return;
    }
    setFaqs(data || []);
  };

  const fetchHeaderLink = async () => {
    const { data } = await supabase
      .from("header_link")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (data) {
      setHeaderLinkId(data.id);
      setHeaderLinkTitle(data.title);
      setHeaderLinkUrl(data.url);
    } else {
      setHeaderLinkId(null);
      setHeaderLinkTitle("");
      setHeaderLinkUrl("");
    }
  };

  const handleSaveHeaderLink = async () => {
    if (!headerLinkTitle || !headerLinkUrl) {
      toast.error("Title and URL are required");
      return;
    }
    setLoading(true);
    if (headerLinkId) {
      const { error } = await supabase
        .from("header_link")
        .update({ title: headerLinkTitle, url: headerLinkUrl })
        .eq("id", headerLinkId);
      if (error) toast.error("Failed to update");
      else toast.success("Header link updated");
    } else {
      const { error } = await supabase
        .from("header_link")
        .insert({ title: headerLinkTitle, url: headerLinkUrl });
      if (error) toast.error("Failed to save");
      else toast.success("Header link saved");
    }
    await fetchHeaderLink();
    setLoading(false);
  };

  const handleDeleteHeaderLink = async () => {
    if (!headerLinkId) return;
    setLoading(true);
    await supabase.from("header_link").delete().eq("id", headerLinkId);
    setHeaderLinkId(null);
    setHeaderLinkTitle("");
    setHeaderLinkUrl("");
    toast.success("Header link removed");
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      fetchLinks();
      fetchFaqs(faqLanguageFilter);
      fetchHeaderLink();
    }
  }, [open, faqLanguageFilter]);

  // App Links handlers
  const handleEditLink = (link: AppLink) => {
    setEditingLinkId(link.id);
    setEditLinkForm({ name: link.name, url: link.url, icon: link.icon, is_primary: link.is_primary });
  };

  const handleSaveEditLink = async () => {
    if (!editingLinkId) return;
    setLoading(true);

    const { error } = await supabase
      .from("app_links")
      .update({ 
        name: editLinkForm.name, 
        url: editLinkForm.url, 
        icon: editLinkForm.icon,
        is_primary: editLinkForm.is_primary 
      })
      .eq("id", editingLinkId);

    if (error) {
      toast.error("Failed to update link");
    } else {
      toast.success("Link updated");
      setEditingLinkId(null);
      fetchLinks();
    }
    setLoading(false);
  };

  const handleDeleteLink = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from("app_links").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete link");
    } else {
      toast.success("Link deleted");
      fetchLinks();
    }
    setLoading(false);
  };

  const handleAddLink = async () => {
    if (!newLinkForm.name || !newLinkForm.url) {
      toast.error("Name and URL are required");
      return;
    }
    setLoading(true);

    const maxOrder = links.length > 0 ? Math.max(...links.map((l) => l.display_order)) : 0;

    const { error } = await supabase.from("app_links").insert({
      name: newLinkForm.name,
      url: newLinkForm.url,
      icon: newLinkForm.icon,
      is_primary: newLinkForm.is_primary,
      display_order: maxOrder + 1,
    });

    if (error) {
      toast.error("Failed to add link");
    } else {
      toast.success("Link added");
      setNewLinkForm({ name: "", url: "", icon: "LayoutDashboard", is_primary: false });
      setIsAddingLink(false);
      fetchLinks();
    }
    setLoading(false);
  };

  // FAQ handlers
  const handleEditFaq = (faq: FAQ) => {
    setEditingFaqId(faq.id);
    setEditFaqForm({ question: faq.question, answer: faq.answer });
  };

  const handleSaveEditFaq = async () => {
    if (!editingFaqId) return;
    setLoading(true);

    const { error } = await supabase
      .from("faqs")
      .update({ 
        question: editFaqForm.question, 
        answer: editFaqForm.answer
      })
      .eq("id", editingFaqId);

    if (error) {
      toast.error("Failed to update FAQ");
    } else {
      toast.success("FAQ updated");
      setEditingFaqId(null);
      fetchFaqs(faqLanguageFilter);
    }
    setLoading(false);
  };

  const handleDeleteFaq = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from("faqs").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete FAQ");
    } else {
      toast.success("FAQ deleted");
      fetchFaqs(faqLanguageFilter);
    }
    setLoading(false);
  };

  const handleAddFaq = async () => {
    if (!newFaqForm.question || !newFaqForm.answer) {
      toast.error("Question and answer are required");
      return;
    }
    setLoading(true);

    const maxOrder = faqs.length > 0 ? Math.max(...faqs.map((f) => f.display_order)) : 0;
    const newOrder = maxOrder + 1;

    // Insert original first
    const { error } = await supabase.from("faqs").insert({
      question: newFaqForm.question,
      answer: newFaqForm.answer,
      language: faqLanguageFilter,
      display_order: newOrder,
    });

    if (error) {
      toast.error("Failed to add FAQ");
      setLoading(false);
      return;
    }

    // Auto-translate to other languages
    try {
      const { data: fnData, error: fnError } = await supabase.functions.invoke("translate-faq", {
        body: {
          question: newFaqForm.question,
          answer: newFaqForm.answer,
          source_language: faqLanguageFilter,
        },
      });

      if (fnError) throw fnError;

      const translations = fnData?.translations;
      if (translations && typeof translations === "object") {
        const inserts = Object.entries(translations).map(([lang, t]: [string, any]) => ({
          question: t.question,
          answer: t.answer,
          language: lang,
          display_order: newOrder,
        }));

        if (inserts.length > 0) {
          const { error: insertErr } = await supabase.from("faqs").insert(inserts);
          if (insertErr) {
            console.error("Translation insert error:", insertErr);
            toast.warning("FAQ added but some translations failed to save");
          } else {
            toast.success("FAQ added & translated to all languages ✨");
          }
        }
      } else {
        toast.success("FAQ added (translation returned empty)");
      }
    } catch (e) {
      console.error("Translation error:", e);
      toast.success("FAQ added, but auto-translation failed");
    }

    setNewFaqForm({ question: "", answer: "" });
    setIsAddingFaq(false);
    fetchFaqs(faqLanguageFilter);
    setLoading(false);
  };

  const handleRetranslate = async (faq: FAQ) => {
    setLoading(true);
    try {
      const { data: fnData, error: fnError } = await supabase.functions.invoke("translate-faq", {
        body: {
          question: faq.question,
          answer: faq.answer,
          source_language: faq.language,
        },
      });

      if (fnError) throw fnError;

      const translations = fnData?.translations;
      if (translations && typeof translations === "object") {
        for (const [lang, t] of Object.entries(translations) as [string, any][]) {
          // Upsert: try to update existing FAQ with same display_order & language, else insert
          const { data: existing } = await supabase
            .from("faqs")
            .select("id")
            .eq("display_order", faq.display_order)
            .eq("language", lang)
            .maybeSingle();

          if (existing) {
            await supabase
              .from("faqs")
              .update({ question: t.question, answer: t.answer })
              .eq("id", existing.id);
          } else {
            await supabase.from("faqs").insert({
              question: t.question,
              answer: t.answer,
              language: lang,
              display_order: faq.display_order,
            });
          }
        }
        toast.success("Translations updated ✨");
      }
    } catch (e) {
      console.error("Re-translate error:", e);
      toast.error("Re-translation failed");
    }
    fetchFaqs(faqLanguageFilter);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admin Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="links" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="links" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              App Links
            </TabsTrigger>
            <TabsTrigger value="faqs" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="header" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Header Link
            </TabsTrigger>
          </TabsList>

          {/* App Links Tab */}
          <TabsContent value="links" className="space-y-3 mt-4">
            {links.map((link) => (
              <div
                key={link.id}
                className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-card/50"
              >
                {editingLinkId === link.id ? (
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Name"
                      value={editLinkForm.name}
                      onChange={(e) => setEditLinkForm({ ...editLinkForm, name: e.target.value })}
                    />
                    <Input
                      placeholder="URL"
                      value={editLinkForm.url}
                      onChange={(e) => setEditLinkForm({ ...editLinkForm, url: e.target.value })}
                    />
                    <select
                      className="w-full p-2 rounded-md border border-border bg-background text-sm"
                      value={editLinkForm.icon}
                      onChange={(e) => setEditLinkForm({ ...editLinkForm, icon: e.target.value })}
                    >
                      {ICON_OPTIONS.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={editLinkForm.is_primary}
                        onChange={(e) => setEditLinkForm({ ...editLinkForm, is_primary: e.target.checked })}
                      />
                      Primary (highlighted)
                    </label>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEditLink} disabled={loading}>
                        <Check className="w-3 h-3 mr-1" /> Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingLinkId(null)}>
                        <X className="w-3 h-3 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{link.name}</span>
                        {link.is_primary && <Star className="w-3 h-3 text-primary fill-primary" />}
                      </div>
                      <span className="text-xs text-muted-foreground truncate block">{link.url}</span>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => handleEditLink(link)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteLink(link.id)}
                      disabled={loading}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </>
                )}
              </div>
            ))}

            {isAddingLink ? (
              <div className="p-3 rounded-lg border border-primary/30 bg-primary/5 space-y-2">
                <Label className="text-xs">Add New Link</Label>
                <Input
                  placeholder="Name"
                  value={newLinkForm.name}
                  onChange={(e) => setNewLinkForm({ ...newLinkForm, name: e.target.value })}
                />
                <Input
                  placeholder="URL"
                  value={newLinkForm.url}
                  onChange={(e) => setNewLinkForm({ ...newLinkForm, url: e.target.value })}
                />
                <select
                  className="w-full p-2 rounded-md border border-border bg-background text-sm"
                  value={newLinkForm.icon}
                  onChange={(e) => setNewLinkForm({ ...newLinkForm, icon: e.target.value })}
                >
                  {ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newLinkForm.is_primary}
                    onChange={(e) => setNewLinkForm({ ...newLinkForm, is_primary: e.target.checked })}
                  />
                  Primary (highlighted)
                </label>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddLink} disabled={loading}>
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsAddingLink(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsAddingLink(true)}
              >
                <Plus className="w-4 h-4 mr-2" /> Add New Link
              </Button>
            )}
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs" className="space-y-3 mt-4">
            {/* Language Filter */}
            <div className="flex items-center gap-2 pb-2 border-b border-border/30">
              <Label className="text-xs text-muted-foreground">Language:</Label>
              <div className="flex gap-1">
                {LANGUAGE_OPTIONS.map((lang) => (
                  <Button
                    key={lang.value}
                    size="sm"
                    variant={faqLanguageFilter === lang.value ? "default" : "outline"}
                    className="h-7 px-2.5 text-xs"
                    onClick={() => setFaqLanguageFilter(lang.value)}
                  >
                    {lang.value.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className="flex items-start gap-2 p-3 rounded-lg border border-border/50 bg-card/50"
              >
                <span className="text-xs text-muted-foreground pt-1 w-5 shrink-0">{index + 1}.</span>
                
                {editingFaqId === faq.id ? (
                  <div className="flex-1 space-y-2">
                    <div>
                      <Label className="text-xs">Question</Label>
                      <Input
                        placeholder="Question"
                        value={editFaqForm.question}
                        onChange={(e) => setEditFaqForm({ ...editFaqForm, question: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Answer</Label>
                      <Textarea
                        placeholder="Answer"
                        value={editFaqForm.answer}
                        onChange={(e) => setEditFaqForm({ ...editFaqForm, answer: e.target.value })}
                        rows={8}
                        className="whitespace-pre-wrap"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEditFaq} disabled={loading}>
                        <Check className="w-3 h-3 mr-1" /> Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingFaqId(null)}>
                        <X className="w-3 h-3 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium mb-1">{faq.question}</p>
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">{faq.answer}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="icon" variant="ghost" onClick={() => handleEditFaq(faq)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteFaq(faq.id)}
                        disabled={loading}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {isAddingFaq ? (
              <div className="p-3 rounded-lg border border-primary/30 bg-primary/5 space-y-2">
                <Label className="text-xs font-medium">Add New FAQ</Label>
                <div>
                  <Label className="text-xs">Question</Label>
                  <Input
                    placeholder="Enter the question"
                    value={newFaqForm.question}
                    onChange={(e) => setNewFaqForm({ ...newFaqForm, question: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Answer</Label>
                  <Textarea
                    placeholder="Enter the answer"
                    value={newFaqForm.answer}
                    onChange={(e) => setNewFaqForm({ ...newFaqForm, answer: e.target.value })}
                    rows={8}
                    className="whitespace-pre-wrap"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddFaq} disabled={loading}>
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsAddingFaq(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsAddingFaq(true)}
              >
                <Plus className="w-4 h-4 mr-2" /> Add New FAQ
              </Button>
            )}
          </TabsContent>

          {/* Header Link Tab */}
          <TabsContent value="header" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Configure a download link or URL that appears in the header bar. Users will see a button with your title.
            </p>
            <div className="space-y-3 p-4 rounded-lg border border-border/50 bg-card/50">
              <div className="space-y-2">
                <Label htmlFor="header-title" className="text-xs">Title (subject)</Label>
                <Input
                  id="header-title"
                  placeholder="e.g. Staff Manual, Menu PDF"
                  value={headerLinkTitle}
                  onChange={(e) => setHeaderLinkTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="header-url" className="text-xs">URL (image or link)</Label>
                <Input
                  id="header-url"
                  placeholder="https://example.com/file.pdf"
                  value={headerLinkUrl}
                  onChange={(e) => setHeaderLinkUrl(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveHeaderLink} disabled={loading}>
                  <Check className="w-3 h-3 mr-1" /> {headerLinkId ? "Update" : "Save"}
                </Button>
                {headerLinkId && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={handleDeleteHeaderLink}
                    disabled={loading}
                  >
                    <Trash2 className="w-3 h-3 mr-1" /> Remove
                  </Button>
                )}
              </div>
            </div>
            {headerLinkId && (
              <div className="p-3 rounded-lg bg-muted/50 border border-border/30">
                <p className="text-xs text-muted-foreground">
                  ✅ Active — "<span className="text-foreground font-medium">{headerLinkTitle}</span>" is visible in the header.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSettingsModal;
