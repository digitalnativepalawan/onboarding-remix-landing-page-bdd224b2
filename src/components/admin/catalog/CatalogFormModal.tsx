import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { CatalogItem, CATALOG_CATEGORIES, emptyCatalogItem } from "./types";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: (CatalogItem & { id: string }) | null;
}

export function CatalogFormModal({ open, onOpenChange, initial }: Props) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<CatalogItem>(emptyCatalogItem);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setDraft(initial ? { ...initial } : emptyCatalogItem);
  }, [open, initial]);

  const setArr = (key: "features" | "tech_stack" | "screenshots", text: string) => {
    setDraft({ ...draft, [key]: text.split("\n").map((s) => s.trim()).filter(Boolean) });
  };

  const save = async () => {
    if (!draft.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: draft.name,
        description: draft.description,
        category: draft.category,
        base_price_php: Number(draft.base_price_php) || 0,
        setup_days: Number(draft.setup_days) || 0,
        features: draft.features,
        tech_stack: draft.tech_stack,
        screenshots: draft.screenshots,
        demo_url: draft.demo_url,
        is_active: draft.is_active,
        display_order: Number(draft.display_order) || 0,
      };
      if (initial?.id) {
        const { error } = await supabase.from("catalog_items").update(payload).eq("id", initial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("catalog_items").insert(payload);
        if (error) throw error;
      }
      qc.invalidateQueries({ queryKey: ["catalog"] });
      toast.success(initial ? "Catalog item updated" : "Catalog item created");
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!initial?.id) return;
    if (!confirm("Delete this catalog item?")) return;
    const { error } = await supabase.from("catalog_items").delete().eq("id", initial.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["catalog"] });
    toast.success("Deleted");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Catalog Item" : "New Catalog Item"}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-3">
          <div className="space-y-4 py-2">
            <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
              <div>
                <Label>Name *</Label>
                <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Resort Booking Website" />
              </div>
              <div className="flex items-center gap-2 pb-2">
                <Switch checked={draft.is_active} onCheckedChange={(v) => setDraft({ ...draft, is_active: v })} />
                <Label className="text-sm">Active</Label>
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea rows={2} value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Short pitch shown on the card" />
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={draft.category ?? "other"} onValueChange={(v) => setDraft({ ...draft, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATALOG_CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Base Price (₱)</Label>
                <Input type="number" min={0} value={draft.base_price_php} onChange={(e) => setDraft({ ...draft, base_price_php: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Setup Days</Label>
                <Input type="number" min={0} value={draft.setup_days} onChange={(e) => setDraft({ ...draft, setup_days: Number(e.target.value) })} />
              </div>
            </div>

            <div>
              <Label>Features <span className="text-muted-foreground text-xs">(one per line)</span></Label>
              <Textarea rows={4} value={draft.features.join("\n")} onChange={(e) => setArr("features", e.target.value)} placeholder="Mobile-friendly booking form&#10;Cloudbeds integration&#10;WhatsApp notifications" />
            </div>

            <div>
              <Label>Tech Stack <span className="text-muted-foreground text-xs">(one per line)</span></Label>
              <Textarea rows={3} value={draft.tech_stack.join("\n")} onChange={(e) => setArr("tech_stack", e.target.value)} placeholder="React&#10;Supabase&#10;Cloudbeds API" />
            </div>

            <div>
              <Label>Screenshot URLs <span className="text-muted-foreground text-xs">(one per line, first is cover)</span></Label>
              <Textarea rows={3} value={draft.screenshots.join("\n")} onChange={(e) => setArr("screenshots", e.target.value)} placeholder="https://..." />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Demo URL</Label>
                <Input value={draft.demo_url ?? ""} onChange={(e) => setDraft({ ...draft, demo_url: e.target.value })} placeholder="https://demo.example.com" />
              </div>
              <div>
                <Label>Display Order</Label>
                <Input type="number" value={draft.display_order} onChange={(e) => setDraft({ ...draft, display_order: Number(e.target.value) })} />
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-row justify-between gap-2 border-t pt-3">
          <div>
            {initial?.id && (
              <Button variant="ghost" onClick={remove} className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
