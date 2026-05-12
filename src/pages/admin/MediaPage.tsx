import { useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Upload, LinkIcon, Trash2, Download, Copy, Image as ImageIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import JSZip from "jszip";

const CATEGORIES = [
  "uncategorized", "logo", "screenshot", "hero", "icon",
  "product", "marketing", "client", "project", "other",
];

function bytes(n?: number | null) {
  if (!n) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export default function MediaPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<string>("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [urlOpen, setUrlOpen] = useState(false);
  const [preview, setPreview] = useState<any | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [downloading, setDownloading] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["media-library"],
    queryFn: async () => {
      const { data } = await supabase
        .from("media")
        .select("*")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();
    return items.filter((it: any) => {
      if (filterCat !== "all" && (it.category || "uncategorized") !== filterCat) return false;
      if (!s) return true;
      return (
        (it.title || "").toLowerCase().includes(s) ||
        (it.alt_text || "").toLowerCase().includes(s) ||
        (it.category || "").toLowerCase().includes(s) ||
        (it.folder || "").toLowerCase().includes(s) ||
        (it.tags || []).join(" ").toLowerCase().includes(s)
      );
    });
  }, [items, search, filterCat]);

  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {};
    filtered.forEach((it: any) => {
      const k = it.category || "uncategorized";
      (map[k] ||= []).push(it);
    });
    return map;
  }, [filtered]);

  const remove = async (item: any) => {
    if (!confirm(`Delete "${item.title || item.file_path}"?`)) return;
    if (!item.source_url && item.file_path) {
      await supabase.storage.from("media").remove([item.file_path]);
    }
    await supabase.from("media").delete().eq("id", item.id);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["media-library"] });
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const allSelected = filtered.length > 0 && filtered.every((i: any) => selected.has(i.id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map((i: any) => i.id)));
  };

  const downloadSelected = async () => {
    const picks = items.filter((i: any) => selected.has(i.id));
    if (!picks.length) return toast.error("Nothing selected");
    setDownloading(true);
    try {
      if (picks.length === 1) {
        const it = picks[0];
        const res = await fetch(it.file_url);
        const blob = await res.blob();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = (it.title || it.file_path?.split("/").pop() || "image").replace(/[^\w.\-]/g, "_");
        a.click();
        URL.revokeObjectURL(a.href);
      } else {
        const zip = new JSZip();
        const used = new Set<string>();
        let ok = 0;
        for (const it of picks) {
          try {
            const res = await fetch(it.file_url);
            if (!res.ok) continue;
            const blob = await res.blob();
            const ext = (blob.type.split("/")[1] || "jpg").split("+")[0];
            let base = (it.title || it.file_path?.split("/").pop()?.replace(/\.[^.]+$/, "") || "image").replace(/[^\w.\-]/g, "_");
            let name = `${base}.${ext}`;
            let n = 1;
            while (used.has(name)) name = `${base}-${n++}.${ext}`;
            used.add(name);
            zip.file(name, blob);
            ok++;
          } catch {}
        }
        if (!ok) throw new Error("All downloads failed");
        const out = await zip.generateAsync({ type: "blob" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(out);
        a.download = `media-${new Date().toISOString().slice(0, 10)}.zip`;
        a.click();
        URL.revokeObjectURL(a.href);
      }
      toast.success(`Downloaded ${picks.length} item(s)`);
    } catch (e: any) {
      toast.error(e.message || "Download failed");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-sm text-muted-foreground">Upload from device or import multiple URLs · search by category</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectMode ? "default" : "outline"}
            onClick={() => { setSelectMode((m) => !m); setSelected(new Set()); }}
            className="flex-1 sm:flex-none"
          >
            {selectMode ? "Done" : "Select"}
          </Button>
          <Button variant="outline" onClick={() => setUrlOpen(true)} className="flex-1 sm:flex-none">
            <LinkIcon className="h-4 w-4 mr-2" /> Import URLs
          </Button>
          <Button onClick={() => setUploadOpen(true)} className="flex-1 sm:flex-none">
            <Upload className="h-4 w-4 mr-2" /> Upload
          </Button>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Total</div><p className="text-2xl font-bold mt-1">{items.length}</p></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Categories</div><p className="text-2xl font-bold mt-1">{Object.keys(grouped).length}</p></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Uploaded</div><p className="text-2xl font-bold mt-1">{items.filter((i: any) => !i.source_url).length}</p></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">From URL</div><p className="text-2xl font-bold mt-1">{items.filter((i: any) => i.source_url).length}</p></Card>
      </div>

      {/* search + filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, tags, alt text..." className="pl-9" />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-full sm:w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories ({items.length})</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c} ({items.filter((i: any) => (i.category || "uncategorized") === c).length})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectMode && (
        <Card className="p-3 flex flex-wrap items-center gap-3 sticky top-2 z-10">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
            Select all ({filtered.length})
          </label>
          <span className="text-sm text-muted-foreground">{selected.size} selected</span>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelected(new Set())} disabled={!selected.size || downloading}>
              Clear
            </Button>
            <Button size="sm" onClick={downloadSelected} disabled={!selected.size || downloading}>
              <Download className="h-4 w-4 mr-2" />
              {downloading ? "Preparing..." : `Download${selected.size > 1 ? " ZIP" : ""}`}
            </Button>
          </div>
        </Card>
      )}

      {/* grid */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Loading...</p>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No media yet. Upload files or import from URLs to get started.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((it: any) => (
            <Card key={it.id} className={`relative group overflow-hidden hover:ring-2 hover:ring-primary transition cursor-pointer ${selectMode && selected.has(it.id) ? "ring-2 ring-primary" : ""}`}>
              {selectMode && (
                <div className="absolute top-1.5 left-1.5 z-10 bg-background/90 backdrop-blur rounded p-1">
                  <Checkbox checked={selected.has(it.id)} onCheckedChange={() => toggleOne(it.id)} />
                </div>
              )}
              <button
                onClick={() => (selectMode ? toggleOne(it.id) : setPreview(it))}
                className="block w-full aspect-square bg-muted overflow-hidden"
              >
                <img src={it.file_url} alt={it.alt_text || it.title || ""} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition" />
              </button>
              <div className="p-2 space-y-1">
                <p className="text-xs font-medium truncate">{it.title || "Untitled"}</p>
                <div className="flex items-center justify-between gap-1">
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 truncate max-w-full">
                    {it.category || "uncategorized"}
                  </Badge>
                  <Button size="icon" variant="ghost" className="h-6 w-6 shrink-0 text-destructive" onClick={(e) => { e.stopPropagation(); remove(it); }}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
      <UrlImportDialog open={urlOpen} onOpenChange={setUrlOpen} />
      <PreviewDialog item={preview} onClose={() => setPreview(null)} onChange={() => qc.invalidateQueries({ queryKey: ["media-library"] })} />
    </div>
  );
}

/* ============== Upload from device ============== */
function UploadDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState("uncategorized");
  const [folder, setFolder] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const reset = () => { setFiles([]); setCategory("uncategorized"); setFolder(""); setProgress({ done: 0, total: 0 }); };

  const upload = async () => {
    if (!files.length) return;
    setUploading(true);
    setProgress({ done: 0, total: files.length });
    let okCount = 0;
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `${folder ? folder + "/" : ""}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, file, { upsert: false, contentType: file.type });
      if (upErr) { toast.error(`${file.name}: ${upErr.message}`); setProgress((p) => ({ ...p, done: p.done + 1 })); continue; }
      const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
      const { error: dbErr } = await supabase.from("media").insert({
        file_path: path,
        file_url: pub.publicUrl,
        title: file.name.replace(/\.[^.]+$/, ""),
        media_type: file.type,
        size_bytes: file.size,
        category,
        folder: folder || null,
      });
      if (dbErr) toast.error(dbErr.message); else okCount++;
      setProgress((p) => ({ ...p, done: p.done + 1 }));
    }
    setUploading(false);
    toast.success(`Uploaded ${okCount}/${files.length}`);
    qc.invalidateQueries({ queryKey: ["media-library"] });
    if (okCount === files.length) { reset(); onOpenChange(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!uploading) { onOpenChange(o); if (!o) reset(); } }}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Upload from device</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Files (multiple allowed)</label>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="hidden"
            />
            <button
              onClick={() => inputRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-md p-6 text-center hover:bg-accent transition"
            >
              <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm">{files.length ? `${files.length} file(s) selected` : "Click to choose images"}</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF, WebP, SVG</p>
            </button>
            {files.length > 0 && (
              <div className="mt-2 max-h-32 overflow-y-auto text-xs space-y-0.5">
                {files.map((f, i) => <div key={i} className="flex justify-between"><span className="truncate">{f.name}</span><span className="text-muted-foreground">{bytes(f.size)}</span></div>)}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1.5">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Folder (optional)</label>
              <Input value={folder} onChange={(e) => setFolder(e.target.value.replace(/[^a-z0-9-_/]/gi, ""))} placeholder="e.g. clients/acme" />
            </div>
          </div>
          {uploading && <p className="text-sm text-center text-muted-foreground">Uploading {progress.done}/{progress.total}...</p>}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>Cancel</Button>
            <Button onClick={upload} disabled={!files.length || uploading}>
              <Upload className="h-4 w-4 mr-2" /> Upload {files.length || ""}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ============== Import from URLs ============== */
function UrlImportDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const qc = useQueryClient();
  const [urls, setUrls] = useState("");
  const [category, setCategory] = useState("uncategorized");
  const [folder, setFolder] = useState("");
  const [downloadCopy, setDownloadCopy] = useState(true);
  const [busy, setBusy] = useState(false);

  const importAll = async () => {
    const list = urls.split(/\s+/).map((u) => u.trim()).filter((u) => /^https?:\/\//i.test(u));
    if (!list.length) return toast.error("No valid URLs found");
    setBusy(true);
    let ok = 0;
    for (const url of list) {
      try {
        const name = url.split("/").pop()?.split("?")[0] || "image";
        const title = name.replace(/\.[^.]+$/, "");
        let file_url = url;
        let file_path = url;
        let size: number | null = null;
        let mime: string | null = null;

        if (downloadCopy) {
          const res = await fetch(url, { mode: "cors" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const blob = await res.blob();
          mime = blob.type || "image/jpeg";
          size = blob.size;
          const ext = (mime.split("/")[1] || "jpg").split("+")[0];
          const path = `${folder ? folder + "/" : ""}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
          const { error: upErr } = await supabase.storage.from("media").upload(path, blob, { contentType: mime });
          if (upErr) throw upErr;
          file_path = path;
          file_url = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
        }

        const { error } = await supabase.from("media").insert({
          file_path,
          file_url,
          source_url: url,
          title,
          category,
          folder: folder || null,
          media_type: mime,
          size_bytes: size,
        });
        if (error) throw error;
        ok++;
      } catch (e: any) {
        toast.error(`${url.slice(0, 40)}...: ${e.message || "failed"}`);
      }
    }
    setBusy(false);
    toast.success(`Imported ${ok}/${list.length}`);
    qc.invalidateQueries({ queryKey: ["media-library"] });
    if (ok > 0) { setUrls(""); onOpenChange(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!busy) onOpenChange(o); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Import from URLs</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Image URLs (one per line, or space-separated)</label>
            <Textarea
              rows={6}
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder={"https://example.com/photo1.jpg\nhttps://example.com/photo2.png"}
              className="font-mono text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1.5">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Folder (optional)</label>
              <Input value={folder} onChange={(e) => setFolder(e.target.value.replace(/[^a-z0-9-_/]/gi, ""))} placeholder="e.g. inspiration" />
            </div>
          </div>
          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={downloadCopy} onChange={(e) => setDownloadCopy(e.target.checked)} className="mt-0.5" />
            <span>
              <span className="font-medium">Download a local copy</span>
              <span className="block text-xs text-muted-foreground">Saves the image to your library so it stays available even if the source goes offline. Disable to only store the URL.</span>
            </span>
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button>
            <Button onClick={importAll} disabled={!urls.trim() || busy}>
              <LinkIcon className="h-4 w-4 mr-2" /> {busy ? "Importing..." : "Import"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ============== Preview / Edit ============== */
function PreviewDialog({ item, onClose, onChange }: { item: any | null; onClose: () => void; onChange: () => void }) {
  const [tab, setTab] = useState("preview");
  const [title, setTitle] = useState(item?.title || "");
  const [category, setCategory] = useState(item?.category || "uncategorized");
  const [alt, setAlt] = useState(item?.alt_text || "");
  const [tags, setTags] = useState((item?.tags || []).join(", "));

  if (!item) return null;

  const save = async () => {
    await supabase.from("media").update({
      title,
      category,
      alt_text: alt,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    }).eq("id", item.id);
    toast.success("Saved");
    onChange();
    onClose();
  };

  const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copied"); };

  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader><DialogTitle className="truncate">{item.title || "Untitled"}</DialogTitle></DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-2 w-full"><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="details">Details</TabsTrigger></TabsList>
          <TabsContent value="preview" className="space-y-3">
            <div className="bg-muted rounded-md overflow-hidden flex items-center justify-center max-h-[60vh]">
              <img src={item.file_url} alt={item.alt_text || ""} className="max-w-full max-h-[60vh] object-contain" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => copy(item.file_url)}><Copy className="h-3 w-3 mr-1" /> Copy URL</Button>
              <Button size="sm" variant="outline" asChild><a href={item.file_url} download target="_blank" rel="noreferrer"><Download className="h-3 w-3 mr-1" /> Download</a></Button>
              {item.source_url && <Button size="sm" variant="outline" asChild><a href={item.source_url} target="_blank" rel="noreferrer">Source</a></Button>}
            </div>
            <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
              <span>Size: {bytes(item.size_bytes)}</span>
              <span>Type: {item.media_type || "—"}</span>
              <span>Folder: {item.folder || "—"}</span>
              <span>Added: {new Date(item.created_at).toLocaleDateString()}</span>
            </div>
          </TabsContent>
          <TabsContent value="details" className="space-y-3">
            <div><label className="text-sm font-medium block mb-1.5">Title</label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div><label className="text-sm font-medium block mb-1.5">Category</label>
              <Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
            </div>
            <div><label className="text-sm font-medium block mb-1.5">Alt text</label><Input value={alt} onChange={(e) => setAlt(e.target.value)} /></div>
            <div><label className="text-sm font-medium block mb-1.5">Tags (comma-separated)</label><Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="hero, dark, banner" /></div>
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={save}><Plus className="h-4 w-4 mr-2" />Save</Button></div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
