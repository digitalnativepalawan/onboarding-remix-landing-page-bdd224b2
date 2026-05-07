import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ProductImagesManager, ProductImage } from "@/components/admin/products/ProductImagesManager";

export interface ResortOSCard {
  id?: string;
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  images: ProductImage[];
  image_right: boolean;
  is_visible: boolean;
  sort_order: number;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: ResortOSCard | null;
  nextSortOrder: number;
  onSaved: () => void;
}

const empty = (sortOrder: number): ResortOSCard => ({
  eyebrow: "",
  title: "",
  body: "",
  bullets: [],
  images: [],
  image_right: true,
  is_visible: true,
  sort_order: sortOrder,
});

export function ResortOSCardModal({ open, onOpenChange, initial, nextSortOrder, onSaved }: Props) {
  const [draftId, setDraftId] = useState<string>("");
  const [card, setCard] = useState<ResortOSCard>(empty(nextSortOrder));
  const [saving, setSaving] = useState(false);
  const [bulletsText, setBulletsText] = useState("");

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setCard(initial);
      setDraftId(initial.id!);
      setBulletsText(initial.bullets.join("\n"));
    } else {
      const id = crypto.randomUUID();
      setDraftId(id);
      setCard({ ...empty(nextSortOrder), id });
      setBulletsText("");
    }
  }, [open, initial, nextSortOrder]);

  const save = async () => {
    if (!card.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    const bullets = bulletsText.split("\n").map((s) => s.trim()).filter(Boolean);
    const payload = {
      eyebrow: card.eyebrow,
      title: card.title,
      body: card.body,
      bullets,
      images: card.images,
      image_right: card.image_right,
      is_visible: card.is_visible,
      sort_order: card.sort_order,
    };
    try {
      if (initial?.id) {
        const { error } = await supabase.from("resort_os_cards").update(payload).eq("id", initial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("resort_os_cards").insert({ ...payload, id: draftId });
        if (error) throw error;
      }
      toast.success("Card saved");
      onSaved();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!initial?.id) return;
    if (!confirm("Delete this card?")) return;
    const { error } = await supabase.from("resort_os_cards").delete().eq("id", initial.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Card deleted");
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Card" : "New Card"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Eyebrow</Label>
              <Input
                value={card.eyebrow}
                onChange={(e) => setCard({ ...card, eyebrow: e.target.value })}
                placeholder="THE PLATFORM"
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={card.title}
                onChange={(e) => setCard({ ...card, title: e.target.value })}
                placeholder="One login. Every role."
              />
            </div>
          </div>

          <div>
            <Label>Body</Label>
            <Textarea
              value={card.body}
              rows={3}
              onChange={(e) => setCard({ ...card, body: e.target.value })}
            />
          </div>

          <div>
            <Label>Bullets (one per line)</Label>
            <Textarea
              value={bulletsText}
              rows={4}
              onChange={(e) => setBulletsText(e.target.value)}
              placeholder={"Guest portal\nStaff dashboard\nKitchen board"}
            />
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Switch
                checked={card.image_right}
                onCheckedChange={(v) => setCard({ ...card, image_right: v })}
              />
              <Label className="cursor-pointer">Image on right</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={card.is_visible}
                onCheckedChange={(v) => setCard({ ...card, is_visible: v })}
              />
              <Label className="cursor-pointer">Visible</Label>
            </div>
            <div className="flex items-center gap-2">
              <Label>Order</Label>
              <Input
                type="number"
                value={card.sort_order}
                onChange={(e) => setCard({ ...card, sort_order: Number(e.target.value) || 0 })}
                className="w-20"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <ProductImagesManager
              productId={`resort-os/${draftId}`}
              images={card.images}
              onChange={(imgs) => setCard({ ...card, images: imgs })}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Images upload immediately. Click Save to publish card changes.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {initial?.id && (
            <Button variant="destructive" onClick={remove} className="sm:mr-auto">
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}