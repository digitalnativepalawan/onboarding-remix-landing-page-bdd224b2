import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "dev", label: "Dev Tools" },
  { value: "design", label: "Design" },
  { value: "api", label: "APIs" },
  { value: "docs", label: "Docs" },
  { value: "other", label: "Other" },
];

function LinkForm({ projectId, link, onClose }: { projectId: string; link?: any; onClose: () => void }) {
  const qc = useQueryClient();
  const [label, setLabel] = useState(link?.label ?? "");
  const [url, setUrl] = useState(link?.url ?? "");
  const [category, setCategory] = useState(link?.category ?? "other");

  const save = async () => {
    if (!label.trim() || !url.trim()) return toast.error("Label and URL required");
    const payload = { label, url, category, project_id: projectId };
    const { error } = link
      ? await supabase.from("project_links").update(payload).eq("id", link.id)
      : await supabase.from("project_links").insert(payload);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["project-links", projectId] });
    onClose();
  };

  return (
    <div className="space-y-3">
      <Input placeholder="Label" value={label} onChange={(e) => setLabel(e.target.value)} />
      <Input placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
      </Select>
      <DialogFooter><Button onClick={save} className="w-full sm:w-auto">Save</Button></DialogFooter>
    </div>
  );
}

export function LinksTab({ projectId }: { projectId: string }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { data: links = [] } = useQuery({
    queryKey: ["project-links", projectId],
    queryFn: async () => {
      const { data } = await supabase.from("project_links").select("*").eq("project_id", projectId).order("display_order").order("created_at");
      return data ?? [];
    },
  });

  const remove = async (id: string) => {
    await supabase.from("project_links").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["project-links", projectId] });
  };

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
        <DialogTrigger asChild>
          <Button onClick={() => setEditing(null)} className="w-full sm:w-auto"><Plus className="h-4 w-4 mr-1" /> Add link</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit link" : "New link"}</DialogTitle></DialogHeader>
          <LinkForm projectId={projectId} link={editing} onClose={() => { setOpen(false); setEditing(null); }} />
        </DialogContent>
      </Dialog>

      {CATEGORIES.map((cat) => {
        const items = links.filter((l: any) => l.category === cat.value);
        if (!items.length) return null;
        return (
          <div key={cat.value} className="space-y-2">
            <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">{cat.label}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {items.map((l: any) => (
                <Card key={l.id} className="p-3 flex items-center gap-2">
                  <a href={l.url} target="_blank" rel="noreferrer" className="flex-1 min-w-0 group">
                    <div className="font-medium text-sm truncate group-hover:text-primary">{l.label}</div>
                    <div className="text-xs text-muted-foreground truncate">{l.url}</div>
                  </a>
                  <a href={l.url} target="_blank" rel="noreferrer"><Button size="icon" variant="ghost" className="h-9 w-9"><ExternalLink className="h-4 w-4" /></Button></a>
                  <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => { setEditing(l); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-9 w-9 text-destructive" onClick={() => remove(l.id)}><Trash2 className="h-4 w-4" /></Button>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
      {links.length === 0 && <Card className="p-8 text-center text-sm text-muted-foreground">No links yet.</Card>}
    </div>
  );
}
