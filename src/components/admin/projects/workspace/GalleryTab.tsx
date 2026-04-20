import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Upload, Trash2, ImageIcon } from "lucide-react";
import { toast } from "sonner";

export function GalleryTab({ projectId }: { projectId: string }) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);

  const { data: images = [] } = useQuery({
    queryKey: ["project-media", projectId],
    queryFn: async () => {
      const { data } = await supabase.from("media").select("*").eq("project_id", projectId).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const upload = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!arr.length) return;
    setUploading(arr.length);
    for (const file of arr) {
      const path = `${projectId}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, file);
      if (upErr) { toast.error(upErr.message); continue; }
      const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
      await supabase.from("media").insert({ project_id: projectId, file_path: path, file_url: pub.publicUrl, size_bytes: file.size, media_type: "image" });
    }
    setUploading(0);
    qc.invalidateQueries({ queryKey: ["project-media", projectId] });
    toast.success("Upload complete");
  };

  const remove = async (img: any) => {
    await supabase.storage.from("media").remove([img.file_path]);
    await supabase.from("media").delete().eq("id", img.id);
    qc.invalidateQueries({ queryKey: ["project-media", projectId] });
  };

  return (
    <div className="space-y-4">
      <Card
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); upload(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}
        className={`p-8 border-2 border-dashed cursor-pointer text-center transition-colors ${dragOver ? "border-primary bg-accent" : "border-border"}`}
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium">Drop images here or click to upload</p>
        <p className="text-xs text-muted-foreground mt-1">{uploading > 0 ? `Uploading ${uploading}...` : "PNG, JPG, WebP"}</p>
        <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && upload(e.target.files)} />
      </Card>

      {images.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground"><ImageIcon className="h-6 w-6 mx-auto mb-2" />No images yet.</Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img: any) => (
            <Card key={img.id} className="relative group overflow-hidden aspect-square">
              <img src={img.file_url} alt={img.alt_text || ""} loading="lazy" className="w-full h-full object-cover cursor-pointer" onClick={() => setPreview(img.file_url)} />
              <Button size="icon" variant="destructive" className="absolute top-1 right-1 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => remove(img)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-5xl p-2">
          {preview && <img src={preview} alt="" className="w-full h-auto max-h-[85vh] object-contain" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
