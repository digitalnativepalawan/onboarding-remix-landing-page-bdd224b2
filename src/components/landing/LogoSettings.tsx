import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Trash2, AlertTriangle, Sun, Moon } from "lucide-react";

interface LogoSettingsProps {
  logoLightUrl: string | null;
  logoDarkUrl: string | null;
  onUpdate: () => void;
}

const LogoUploadCard = ({
  label,
  icon: Icon,
  currentUrl,
  variant,
  onUploaded,
  onRemoved,
}: {
  label: string;
  icon: typeof Sun;
  currentUrl: string | null;
  variant: "light" | "dark";
  onUploaded: (url: string) => void;
  onRemoved: () => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [transparencyWarning, setTransparencyWarning] = useState(false);

  const checkTransparency = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = Math.min(img.width, 100);
        canvas.height = Math.min(img.height, 100);
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(true); return; }        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let hasTransparency = false;
        for (let i = 3; i < imageData.data.length; i += 4) {
          if (imageData.data[i] < 250) {
            hasTransparency = true;
            break;
          }
        }
        URL.revokeObjectURL(url);
        resolve(hasTransparency);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(true);
      };
      img.src = url;
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    setTransparencyWarning(false);

    if (file.type === "image/png") {
      const hasTransparency = await checkTransparency(file);
      if (!hasTransparency) {
        setTransparencyWarning(true);
      }
    } else if (file.type !== "image/svg+xml") {
      setTransparencyWarning(true);
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `logo-${variant}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(fileName, file, { cacheControl: "3600", upsert: true });

    if (uploadError) {
      toast.error("Failed to upload logo: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("logos")
      .getPublicUrl(fileName);

    onUploaded(urlData.publicUrl);
    setUploading(false);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2 p-3 rounded-lg border border-border/50 bg-card/50">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <Label className="text-sm font-medium">{label}</Label>
      </div>

      {currentUrl ? (
        <div className="space-y-2">
          <div
            className={`relative rounded-lg p-4 flex items-center justify-center min-h-[80px] ${
              variant === "dark" ? "bg-gray-900" : "bg-gray-100"
            }`}
          >
            <img
              src={currentUrl}
              alt={`${label} preview`}
              className="max-h-20 max-w-full object-contain"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="w-3 h-3 mr-1" />
              Replace
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-500 hover:text-red-600"
              onClick={onRemoved}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-border/50 rounded-lg p-4 text-center hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer disabled:opacity-50"
        >
          <Upload className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            {uploading ? "Uploading..." : "Click to upload PNG, SVG, or WebP (transparency preferred)"}
          </p>
        </button>
      )}

      {transparencyWarning && (
        <div className="flex items-start gap-2 p-2 rounded-md bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-500">
            This image may not have transparency. For best results in both light and dark modes, use a PNG with a transparent background.
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/svg+xml,image/webp"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
};

const LogoSettings = ({ logoLightUrl, logoDarkUrl, onUpdate }: LogoSettingsProps) => {
  const [saving, setSaving] = useState(false);

  const saveLogo = async (field: "logo_light_url" | "logo_dark_url", url: string | null) => {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        [field]: url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", "default");
    if (error) {
      toast.error("Failed to save logo setting");
    } else {
      toast.success(url ? "Logo uploaded" : "Logo removed");
      onUpdate();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground pb-2 border-b border-border/30">
        Upload logos for light and dark modes. PNG with transparency is recommended.
        The logo will appear in the site header and hero section.
      </p>

      <LogoUploadCard
        label="Light Mode Logo"
        icon={Sun}
        currentUrl={logoLightUrl}
        variant="light"
        onUploaded={(url) => saveLogo("logo_light_url", url)}
        onRemoved={() => saveLogo("logo_light_url", null)}
      />

      <LogoUploadCard
        label="Dark Mode Logo"
        icon={Moon}
        currentUrl={logoDarkUrl}
        variant="dark"
        onUploaded={(url) => saveLogo("logo_dark_url", url)}
        onRemoved={() => saveLogo("logo_dark_url", null)}
      />

      {!logoLightUrl && !logoDarkUrl && (
        <p className="text-xs text-muted-foreground/60 text-center py-2">
          No custom logos uploaded. The default Palawan Collective logo will be used.
        </p>
      )}

      {saving && (
        <p className="text-xs text-muted-foreground text-center">Saving...</p>
      )}
    </div>
  );
};

export default LogoSettings;
