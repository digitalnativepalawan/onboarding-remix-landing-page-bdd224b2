import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { ProductImagesManager, ProductImage } from "./ProductImagesManager";

export interface ProductRow {
  id?: string;
  title: string;
  category: string;
  description: string;
  url: string;
  hostname: string;
  accent_color: string;
  is_visible: boolean;
  sort_order: number;
  preview_type: string;
  legacy_component_key: string | null;
  images: ProductImage[];
}

const empty: ProductRow = {
  title: "",
  category: "",
  description: "",
  url: "",
  hostname: "",
  accent_color: "#FF4D2E",
  is_visible: true,
  sort_order: 0,
  preview_type: "screenshots",
  legacy_component_key: null,
  images: [],
};

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: ProductRow | null;
  nextSortOrder: number;
}

function deriveHostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
}

export function ProductFormModal({ open, onOpenChange, initial, nextSortOrder }: Props) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<ProductRow>(empty);
  const [saving, setSaving] = useState(false);
  const [draftId, setDraftId] = useState<string>("");

  useEffect(() => {
    if (open) {
      setDraft(
        initial
          ? { ...initial, images: Array.isArray(initial.images) ? initial.images : [] }
          : { ...empty, sort_order: nextSortOrder }
      );
      setDraftId(initial?.id || crypto.randomUUID());
    }
  }, [open, initial, nextSortOrder]);

  const isEdit = !!initial?.id;

  const persist = async (patch: Partial<ProductRow>) => {
    if (!isEdit) return;
    const { error } = await supabase.from("products").update(patch as any).eq("id", initial!.id!);
    if (error) toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-products"] });
  };

  const handleImagesChange = async (next: ProductImage[]) => {
    setDraft({ ...draft, images: next });
    if (isEdit) {
      await persist({ images: next });
    }
  };

  const save = async () => {
    if (!draft.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!draft.url.trim()) {
      toast.error("URL is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: draft.title.trim(),
        category: draft.category.trim() || "Other",
        description: draft.description,
        url: draft.url.trim(),
        hostname: (draft.hostname || deriveHostname(draft.url)).trim(),
        accent_color: draft.accent_color,
        is_visible: draft.is_visible,
        sort_order: Number(draft.sort_order) || 0,
        preview_type: draft.preview_type,
        legacy_component_key: draft.legacy_component_key,
        images: draft.images as any,
      };
      if (isEdit) {
        const { error } = await supabase.from("products").update(payload).eq("id", initial!.id!);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert({ id: draftId, ...payload });
        if (error) throw error;
      }
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success(isEdit ? "Product updated" : "Product created");
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!isEdit) return;
    if (!confirm(`Delete "${draft.title}"? This will also delete its images.`)) return;
    try {
      if (draft.images.length) {
        await supabase.storage.from("product-images").remove(draft.images.map((i) => i.path));
      }
      const { error } = await supabase.from("products").delete().eq("id", initial!.id!);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product deleted");
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || "Delete failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Product" : "New Product"}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-3">
          <div className="space-y-4 py-2">
            <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
              <div>
                <Label>Title *</Label>
                <Input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  placeholder="e.g. BackOffice Resort WebApp"
                />
              </div>
              <div className="flex items-center gap-2 pb-2">
                <Switch
                  checked={draft.is_visible}
                  onCheckedChange={(v) => setDraft({ ...draft, is_visible: v })}
                />
                <Label className="text-sm">Visible on site</Label>
              </div>
            </div>

            <div>
              <Label>Category</Label>
              <Input
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                placeholder="e.g. Resort ops"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                placeholder="Short pitch shown on the product card"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>URL *</Label>
                <Input
                  value={draft.url}
                  onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                  onBlur={() => {
                    if (!draft.hostname && draft.url) {
                      setDraft((d) => ({ ...d, hostname: deriveHostname(d.url) }));
                    }
                  }}
                  placeholder="https://your-app.com"
                />
              </div>
              <div>
                <Label>Hostname (display)</Label>
                <Input
                  value={draft.hostname}
                  onChange={(e) => setDraft({ ...draft, hostname: e.target.value })}
                  placeholder="your-app.com"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <Label>Accent Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={draft.accent_color}
                    onChange={(e) => setDraft({ ...draft, accent_color: e.target.value })}
                    className="h-10 w-12 rounded border border-input bg-background cursor-pointer"
                  />
                  <Input
                    value={draft.accent_color}
                    onChange={(e) => setDraft({ ...draft, accent_color: e.target.value })}
                    placeholder="#FF4D2E"
                  />
                </div>
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={draft.sort_order}
                  onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Preview Type</Label>
                <select
                  value={draft.preview_type}
                  onChange={(e) => setDraft({ ...draft, preview_type: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="screenshots">Screenshots (uploaded images)</option>
                  <option value="legacy_css">Built-in mockup (legacy)</option>
                </select>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-base">Product Images</Label>
                {draft.preview_type === "legacy_css" && (
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, preview_type: "screenshots" })}
                    className="text-xs text-primary hover:underline"
                  >
                    Switch to screenshots →
                  </button>
                )}
              </div>
              {draft.preview_type === "legacy_css" ? (
                <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200 mb-3">
                  ⚠️ This product uses a built-in mockup (<code className="font-mono">{draft.legacy_component_key || "none"}</code>).
                  Uploaded images will <strong>not</strong> show on the website until you switch Preview Type to "Screenshots".
                </div>
              ) : null}
              <ProductImagesManager
                productId={isEdit ? initial!.id! : draftId}
                images={draft.images}
                onChange={handleImagesChange}
              />
              {!isEdit && (
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Images upload immediately. Click Save to publish the product.
                </p>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-row justify-between gap-2 border-t pt-3">
          <div>
            {isEdit && (
              <Button
                variant="ghost"
                onClick={remove}
                className="text-destructive hover:text-destructive"
                type="button"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}