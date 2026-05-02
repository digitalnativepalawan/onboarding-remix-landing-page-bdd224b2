import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, GripVertical, RefreshCw, Image as ImageIcon } from "lucide-react";
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
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface ProductImage {
  path: string;
  url: string;
}

interface Props {
  productId: string;
  images: ProductImage[];
  onChange: (next: ProductImage[]) => void;
}

const BUCKET = "product-images";

function SortableImage({
  img,
  onDelete,
  onReplace,
}: {
  img: ProductImage;
  onDelete: () => void;
  onReplace: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: img.path });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-md overflow-hidden border border-border bg-muted/30"
    >
      <img src={img.url} alt="" className="w-full h-32 object-cover" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
        <button
          {...attributes}
          {...listeners}
          className="p-1.5 rounded bg-background/80 hover:bg-background cursor-grab"
          title="Drag to reorder"
          type="button"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onReplace}
          className="p-1.5 rounded bg-background/80 hover:bg-background"
          title="Replace"
          type="button"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded bg-destructive/80 hover:bg-destructive text-destructive-foreground"
          title="Delete"
          type="button"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function ProductImagesManager({ productId, images, onChange }: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  const replaceInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const uploadFiles = async (files: FileList) => {
    setBusy(true);
    const next: ProductImage[] = [...images];
    try {
      for (const file of Array.from(files)) {
        const path = `${productId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (error) throw error;
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        next.push({ path, url: data.publicUrl });
      }
      onChange(next);
      toast.success(`Uploaded ${files.length} image(s)`);
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (idx: number) => {
    const img = images[idx];
    if (!confirm("Delete this image?")) return;
    setBusy(true);
    try {
      await supabase.storage.from(BUCKET).remove([img.path]);
      const next = images.filter((_, i) => i !== idx);
      onChange(next);
    } catch (e: any) {
      toast.error(e.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  const handleReplaceClick = (idx: number) => {
    setReplaceIndex(idx);
    replaceInput.current?.click();
  };

  const handleReplaceFile = async (file: File) => {
    if (replaceIndex === null) return;
    const old = images[replaceIndex];
    setBusy(true);
    try {
      const path = `${productId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file);
      if (error) throw error;
      await supabase.storage.from(BUCKET).remove([old.path]);
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const next = [...images];
      next[replaceIndex] = { path, url: data.publicUrl };
      onChange(next);
      toast.success("Image replaced");
    } catch (e: any) {
      toast.error(e.message || "Replace failed");
    } finally {
      setBusy(false);
      setReplaceIndex(null);
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex((i) => i.path === active.id);
    const newIndex = images.findIndex((i) => i.path === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onChange(arrayMove(images, oldIndex, newIndex));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Images ({images.length})</div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => fileInput.current?.click()}
          disabled={busy}
        >
          <Upload className="w-3.5 h-3.5 mr-1" />
          {busy ? "Uploading..." : "Upload"}
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          ref={replaceInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleReplaceFile(f);
            e.target.value = "";
          }}
        />
      </div>

      {images.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
          <ImageIcon className="w-6 h-6 opacity-50" />
          No images yet. The first image you upload becomes the cover shown on the website.
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map((i) => i.path)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {images.map((img, idx) => (
                <div key={img.path} className="relative">
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 z-10 text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary text-primary-foreground">
                      Cover
                    </span>
                  )}
                  <SortableImage
                    img={img}
                    onDelete={() => handleDelete(idx)}
                    onReplace={() => handleReplaceClick(idx)}
                  />
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}