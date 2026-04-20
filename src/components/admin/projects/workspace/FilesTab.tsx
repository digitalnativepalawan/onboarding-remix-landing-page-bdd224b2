import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, Trash2, FileIcon } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const fmtSize = (b: number) => b < 1024 ? `${b} B` : b < 1024**2 ? `${(b/1024).toFixed(1)} KB` : `${(b/1024**2).toFixed(1)} MB`;

export function FilesTab({ projectId }: { projectId: string }) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(0);

  const { data: files = [] } = useQuery({
    queryKey: ["project-files", projectId],
    queryFn: async () => {
      const { data } = await supabase.from("project_files").select("*").eq("project_id", projectId).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const upload = async (list: FileList | File[]) => {
    const arr = Array.from(list);
    if (!arr.length) return;
    setUploading(arr.length);
    for (const file of arr) {
      const path = `${projectId}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("project-files").upload(path, file);
      if (upErr) { toast.error(upErr.message); continue; }
      const { data: pub } = supabase.storage.from("project-files").getPublicUrl(path);
      await supabase.from("project_files").insert({
        project_id: projectId, file_path: path, file_url: pub.publicUrl,
        file_name: file.name, file_size: file.size, mime_type: file.type,
      });
    }
    setUploading(0);
    qc.invalidateQueries({ queryKey: ["project-files", projectId] });
    toast.success("Uploaded");
  };

  const remove = async (f: any) => {
    await supabase.storage.from("project-files").remove([f.file_path]);
    await supabase.from("project_files").delete().eq("id", f.id);
    qc.invalidateQueries({ queryKey: ["project-files", projectId] });
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
        <p className="text-sm font-medium">Drop files here or click to upload</p>
        <p className="text-xs text-muted-foreground mt-1">{uploading > 0 ? `Uploading ${uploading}...` : "Any file type"}</p>
        <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => e.target.files && upload(e.target.files)} />
      </Card>

      {files.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground"><FileIcon className="h-6 w-6 mx-auto mb-2" />No files yet.</Card>
      ) : (
        <div className="space-y-2">
          {files.map((f: any) => (
            <Card key={f.id} className="p-3 flex items-center gap-3">
              <FileIcon className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{f.file_name}</div>
                <div className="text-xs text-muted-foreground">{fmtSize(f.file_size)} · {formatDistanceToNow(new Date(f.created_at), { addSuffix: true })}</div>
              </div>
              <a href={f.file_url} download target="_blank" rel="noreferrer">
                <Button size="icon" variant="ghost" className="h-9 w-9"><Download className="h-4 w-4" /></Button>
              </a>
              <Button size="icon" variant="ghost" className="h-9 w-9 text-destructive" onClick={() => remove(f)}><Trash2 className="h-4 w-4" /></Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
