import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, GripVertical, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ResortOSCardModal, ResortOSCard } from "@/components/admin/resort-os/ResortOSCardModal";
import { ProductImage } from "@/components/admin/products/ProductImagesManager";

function rowToCard(r: any): ResortOSCard {
  return {
    id: r.id,
    eyebrow: r.eyebrow || "",
    title: r.title || "",
    body: r.body || "",
    bullets: Array.isArray(r.bullets) ? (r.bullets as string[]) : [],
    images: Array.isArray(r.images) ? (r.images as ProductImage[]) : [],
    image_right: !!r.image_right,
    is_visible: !!r.is_visible,
    sort_order: r.sort_order ?? 0,
  };
}

function CardRowItem({
  card,
  onEdit,
  onToggle,
}: {
  card: ResortOSCard;
  onEdit: () => void;
  onToggle: (v: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id! });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  const cover = card.images?.[0]?.url;
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 cursor-grab text-muted-foreground hover:text-foreground"
        type="button"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="w-14 h-14 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden border border-border bg-muted/30">
        {cover ? (
          <img src={cover} alt="" className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium truncate">{card.title || "(untitled)"}</span>
          {card.eyebrow && (
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              {card.eyebrow}
            </span>
          )}
        </div>
        <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
          <ImageIcon className="w-3 h-3" /> {card.images.length} image
          {card.images.length === 1 ? "" : "s"} · {card.bullets.length} bullet
          {card.bullets.length === 1 ? "" : "s"}
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <Switch checked={card.is_visible} onCheckedChange={onToggle} />
        <Button size="sm" variant="outline" onClick={onEdit}>
          <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
        </Button>
      </div>
    </div>
  );
}

export default function ResortOSPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ResortOSCard | null>(null);

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ["admin-resort-os-cards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resort_os_cards")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []).map(rowToCard);
    },
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const nextSortOrder = useMemo(() => {
    const max = cards.reduce((m, c) => Math.max(m, c.sort_order), 0);
    return max + 10;
  }, [cards]);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-resort-os-cards"] });
    qc.invalidateQueries({ queryKey: ["resort-os-cards"] });
  };

  const toggleVisible = async (c: ResortOSCard, value: boolean) => {
    const prev = cards;
    qc.setQueryData<ResortOSCard[]>(["admin-resort-os-cards"], (old) =>
      (old || []).map((x) => (x.id === c.id ? { ...x, is_visible: value } : x))
    );
    const { error } = await supabase
      .from("resort_os_cards")
      .update({ is_visible: value })
      .eq("id", c.id!);
    if (error) {
      qc.setQueryData(["admin-resort-os-cards"], prev);
      toast.error(error.message);
    } else {
      qc.invalidateQueries({ queryKey: ["resort-os-cards"] });
    }
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = cards.findIndex((p) => p.id === active.id);
    const newIndex = cards.findIndex((p) => p.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = arrayMove(cards, oldIndex, newIndex).map((p, i) => ({
      ...p,
      sort_order: (i + 1) * 10,
    }));
    qc.setQueryData(["admin-resort-os-cards"], reordered);
    try {
      await Promise.all(
        reordered.map((p) =>
          supabase.from("resort_os_cards").update({ sort_order: p.sort_order }).eq("id", p.id!)
        )
      );
      refresh();
    } catch (err: any) {
      toast.error(err.message || "Reorder failed");
      refresh();
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Resort Operating System</h2>
          <p className="text-xs text-muted-foreground">
            Manage the story cards in the "One system. Every department." section. Add as many as you like.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-1" /> New Card
        </Button>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : cards.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No cards yet. Click "New Card" to create one.
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={cards.map((c) => c.id!)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {cards.map((c) => (
                <CardRowItem
                  key={c.id}
                  card={c}
                  onEdit={() => {
                    setEditing(c);
                    setOpen(true);
                  }}
                  onToggle={(v) => toggleVisible(c, v)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <ResortOSCardModal
        open={open}
        onOpenChange={setOpen}
        initial={editing}
        nextSortOrder={nextSortOrder}
        onSaved={refresh}
      />
    </div>
  );
}