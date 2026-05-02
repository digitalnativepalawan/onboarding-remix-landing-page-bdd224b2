import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, GripVertical, ExternalLink, ImageIcon } from "lucide-react";
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
import { ProductFormModal, ProductRow } from "@/components/admin/products/ProductFormModal";
import { ProductImage } from "@/components/admin/products/ProductImagesManager";

function rowToProduct(r: any): ProductRow {
  return {
    id: r.id,
    title: r.title || "",
    category: r.category || "",
    description: r.description || "",
    url: r.url || "",
    hostname: r.hostname || "",
    accent_color: r.accent_color || "#FF4D2E",
    is_visible: !!r.is_visible,
    sort_order: r.sort_order ?? 0,
    preview_type: r.preview_type || "screenshots",
    legacy_component_key: r.legacy_component_key ?? null,
    images: Array.isArray(r.images) ? (r.images as ProductImage[]) : [],
  };
}

function ProductRowItem({
  product,
  onEdit,
  onToggle,
}: {
  product: ProductRow;
  onEdit: () => void;
  onToggle: (v: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: product.id! });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  const cover = product.images?.[0]?.url;

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
        title="Drag to reorder"
        type="button"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div
        className="w-14 h-14 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden border border-border"
        style={{ background: cover ? "transparent" : `${product.accent_color}22` }}
      >
        {cover ? (
          <img src={cover} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm font-bold" style={{ color: product.accent_color }}>
            {product.title.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium truncate">{product.title}</span>
          {product.category && (
            <span
              className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{
                background: `${product.accent_color}22`,
                color: product.accent_color,
              }}
            >
              {product.category}
            </span>
          )}
          {product.preview_type === "legacy_css" && (
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              Legacy mockup
            </span>
          )}
        </div>
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mt-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          {product.hostname || product.url}
          <ExternalLink className="w-3 h-3" />
        </a>
        <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
          <ImageIcon className="w-3 h-3" /> {product.images.length} image
          {product.images.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Switch checked={product.is_visible} onCheckedChange={onToggle} />
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {product.is_visible ? "Visible" : "Hidden"}
          </span>
        </div>
        <Button size="sm" variant="outline" onClick={onEdit}>
          <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
        </Button>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []).map(rowToProduct);
    },
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const nextSortOrder = useMemo(() => {
    const max = products.reduce((m, p) => Math.max(m, p.sort_order), 0);
    return max + 10;
  }, [products]);

  const toggleVisible = async (p: ProductRow, value: boolean) => {
    const prev = products;
    qc.setQueryData<ProductRow[]>(["admin-products"], (old) =>
      (old || []).map((x) => (x.id === p.id ? { ...x, is_visible: value } : x))
    );
    const { error } = await supabase
      .from("products")
      .update({ is_visible: value })
      .eq("id", p.id!);
    if (error) {
      qc.setQueryData(["admin-products"], prev);
      toast.error(error.message);
    }
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = products.findIndex((p) => p.id === active.id);
    const newIndex = products.findIndex((p) => p.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = arrayMove(products, oldIndex, newIndex).map((p, i) => ({
      ...p,
      sort_order: (i + 1) * 10,
    }));
    qc.setQueryData(["admin-products"], reordered);
    try {
      await Promise.all(
        reordered.map((p) =>
          supabase.from("products").update({ sort_order: p.sort_order }).eq("id", p.id!)
        )
      );
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    } catch (err: any) {
      toast.error(err.message || "Reorder failed");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Products</h2>
          <p className="text-xs text-muted-foreground">
            Manage the product cards shown on your landing page. Changes are live immediately.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-1" /> New Product
        </Button>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No products yet. Click "New Product" to create one.
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={products.map((p) => p.id!)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {products.map((p) => (
                <ProductRowItem
                  key={p.id}
                  product={p}
                  onEdit={() => {
                    setEditing(p);
                    setOpen(true);
                  }}
                  onToggle={(v) => toggleVisible(p, v)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <ProductFormModal
        open={open}
        onOpenChange={setOpen}
        initial={editing}
        nextSortOrder={nextSortOrder}
      />
    </div>
  );
}