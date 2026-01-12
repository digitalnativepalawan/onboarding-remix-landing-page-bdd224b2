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
import { Pencil, Trash2, Plus, Check, X, Star, Link, HelpCircle } from "lucide-react";

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
}

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
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editFaqForm, setEditFaqForm] = useState({ question: "", answer: "" });
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [newFaqForm, setNewFaqForm] = useState({ question: "", answer: "" });
  
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

  const fetchFaqs = async () => {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast.error("Failed to load FAQs");
      return;
    }
    setFaqs(data || []);
  };

  useEffect(() => {
    if (open) {
      fetchLinks();
      fetchFaqs();
    }
  }, [open]);

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
      fetchFaqs();
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
      fetchFaqs();
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

    const { error } = await supabase.from("faqs").insert({
      question: newFaqForm.question,
      answer: newFaqForm.answer,
      display_order: maxOrder + 1,
    });

    if (error) {
      toast.error("Failed to add FAQ");
    } else {
      toast.success("FAQ added");
      setNewFaqForm({ question: "", answer: "" });
      setIsAddingFaq(false);
      fetchFaqs();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admin Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="links" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="links" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              App Links
            </TabsTrigger>
            <TabsTrigger value="faqs" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              FAQs
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
                        rows={3}
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
                      <p className="text-sm font-medium">{faq.question}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{faq.answer}</p>
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
                    rows={3}
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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSettingsModal;
