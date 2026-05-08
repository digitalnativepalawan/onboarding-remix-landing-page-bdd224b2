import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, X, Save, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface FeedbackItem {
  id: string;
  message: string;
  author_name: string;
  created_at: string;
}

export default function FeedbackPage() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ author_name: "", message: "" });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Failed to load", variant: "destructive" });
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (item: FeedbackItem) => {
    setCreating(false);
    setEditingId(item.id);
    setForm({ author_name: item.author_name || "", message: item.message });
  };

  const cancel = () => {
    setEditingId(null);
    setCreating(false);
    setForm({ author_name: "", message: "" });
  };

  const save = async () => {
    if (!form.message.trim()) {
      toast({ title: "Message required", variant: "destructive" });
      return;
    }
    const payload = {
      author_name: form.author_name.trim() || "Anonymous",
      message: form.message.trim(),
    };
    if (creating) {
      const { error } = await supabase.from("feedback").insert(payload);
      if (error) return toast({ title: "Failed to add", variant: "destructive" });
      toast({ title: "Feedback added" });
    } else if (editingId) {
      const { error } = await supabase.from("feedback").update(payload).eq("id", editingId);
      if (error) return toast({ title: "Failed to update", variant: "destructive" });
      toast({ title: "Feedback updated" });
    }
    cancel();
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this feedback?")) return;
    const { error } = await supabase.from("feedback").delete().eq("id", id);
    if (error) return toast({ title: "Failed to delete", variant: "destructive" });
    toast({ title: "Feedback deleted" });
    load();
  };

  const startCreate = () => {
    setEditingId(null);
    setCreating(true);
    setForm({ author_name: "", message: "" });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Feedback ({items.length})</h2>
        </div>
        {!creating && !editingId && (
          <Button onClick={startCreate} size="sm" className="gap-1">
            <Plus className="w-4 h-4" /> Add feedback
          </Button>
        )}
      </div>

      {(creating || editingId) && (
        <div className="border border-border rounded-md p-4 bg-card space-y-3">
          <h3 className="text-sm font-medium">{creating ? "New feedback" : "Edit feedback"}</h3>
          <Input
            placeholder="Author name (defaults to Anonymous)"
            value={form.author_name}
            onChange={(e) => setForm({ ...form, author_name: e.target.value })}
            maxLength={100}
          />
          <Textarea
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={4}
            maxLength={1000}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={cancel} className="gap-1">
              <X className="w-4 h-4" /> Cancel
            </Button>
            <Button size="sm" onClick={save} className="gap-1">
              <Save className="w-4 h-4" /> Save
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No feedback yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="border border-border rounded-md p-3 sm:p-4 bg-card">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{item.author_name || "Anonymous"}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(item.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap break-words">
                    {item.message}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="icon" variant="ghost" onClick={() => startEdit(item)} title="Edit">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => remove(item.id)}
                    title="Delete"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}