import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";

interface LogoUploaderProps {
  label: string;
  hint?: string;
  fieldKey: string;
  currentUrl: string | null;
  darkPreview?: boolean;
  onChange: (url: string | null) => void;
}

export default function LogoUploader({
  label,
  hint,
  fieldKey,
  currentUrl,
  darkPreview,
  onChange,
}: LogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() || "png";
    const path = `${fieldKey}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("logos")
      .upload(path, file, { cacheControl: "3600", upsert: true });
    if (error) {
      toast.error("Upload failed: " + error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("logos").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2 p-3 rounded-lg border border-border/50 bg-card/40">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        {hint && <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>}
      </div>

      {currentUrl ? (
        <div className="space-y-2">
          <div
            className={`relative rounded-md p-3 flex items-center justify-center min-h-[80px] ${
              darkPreview ? "bg-zinc-900" : "bg-zinc-100"
            }`}
          >
            <img src={currentUrl} alt={label} className="max-h-16 max-w-full object-contain" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading}>
              <Upload className="w-3 h-3 mr-1" /> Replace
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => onChange(null)}
            >
              <Trash2 className="w-3 h-3 mr-1" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-border/50 rounded-md p-4 text-center hover:border-primary/40 hover:bg-primary/5 transition-colors disabled:opacity-50"
        >
          <ImageIcon className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            {uploading ? "Uploading…" : "Click to upload from device"}
          </p>
          <p className="text-[10px] text-muted-foreground/70 mt-0.5">PNG, SVG, JPG · max 5MB</p>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/svg+xml,image/jpeg,image/webp,image/x-icon"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
