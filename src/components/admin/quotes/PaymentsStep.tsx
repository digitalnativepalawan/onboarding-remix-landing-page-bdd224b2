import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Banknote, Smartphone, QrCode, Building2, Upload, Trash2 } from "lucide-react";
import type { QuoteDraft } from "./types";

interface Props {
  draft: QuoteDraft;
  onChange: (patch: Partial<QuoteDraft>) => void;
}

const Row = ({
  icon: Icon,
  title,
  enabled,
  onToggle,
  children,
}: {
  icon: typeof Banknote;
  title: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  children?: React.ReactNode;
}) => (
  <Card className="p-3">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="h-4 w-4 text-primary shrink-0" />
        <p className="text-sm font-medium truncate">{title}</p>
      </div>
      <Switch checked={enabled} onCheckedChange={onToggle} />
    </div>
    {enabled && children && <div className="mt-3 space-y-2">{children}</div>}
  </Card>
);

export default function PaymentsStep({ draft, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const uploadQR = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Image only");
    if (file.size > 5 * 1024 * 1024) return toast.error("Max 5MB");
    setUploading(true);
    const path = `qr-${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("media").upload(path, file, { upsert: true });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    onChange({ payment_qr_url: data.publicUrl });
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-3 py-2">
      <p className="text-xs text-muted-foreground">
        Pick which payment methods appear on the invoice. Disabled methods are hidden from the customer.
      </p>

      <Row
        icon={Banknote}
        title="Cash"
        enabled={!!draft.payment_cash_enabled}
        onToggle={(v) => onChange({ payment_cash_enabled: v })}
      />

      <Row
        icon={Smartphone}
        title="GCash"
        enabled={!!draft.payment_gcash_enabled}
        onToggle={(v) => onChange({ payment_gcash_enabled: v })}
      >
        <div>
          <Label className="text-xs">GCash mobile number</Label>
          <Input
            placeholder="09XX XXX XXXX"
            value={draft.payment_gcash_number ?? ""}
            onChange={(e) => onChange({ payment_gcash_number: e.target.value })}
          />
        </div>
      </Row>

      <Row
        icon={QrCode}
        title="QR Code"
        enabled={!!draft.payment_qr_enabled}
        onToggle={(v) => onChange({ payment_qr_enabled: v })}
      >
        {draft.payment_qr_url ? (
          <div className="flex items-start gap-3">
            <img
              src={draft.payment_qr_url}
              alt="QR code"
              className="w-24 h-24 rounded-md border border-border object-contain bg-white p-1"
            />
            <div className="flex flex-col gap-1.5">
              <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                <Upload className="h-3 w-3 mr-1" /> Replace
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => onChange({ payment_qr_url: null })}
              >
                <Trash2 className="h-3 w-3 mr-1" /> Remove
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full border-2 border-dashed border-border/50 rounded-md p-3 text-center hover:border-primary/40 hover:bg-primary/5 transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              {uploading ? "Uploading…" : "Upload QR image (PNG/JPG, max 5MB)"}
            </p>
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadQR} />
      </Row>

      <Row
        icon={Building2}
        title="Bank Transfer"
        enabled={!!draft.payment_bank_enabled}
        onToggle={(v) => onChange({ payment_bank_enabled: v })}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Bank name</Label>
            <Input
              placeholder="e.g. BPI"
              value={draft.payment_bank_name ?? ""}
              onChange={(e) => onChange({ payment_bank_name: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs">Account name</Label>
            <Input
              value={draft.payment_bank_account_name ?? ""}
              onChange={(e) => onChange({ payment_bank_account_name: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">Account number</Label>
            <Input
              value={draft.payment_bank_account_number ?? ""}
              onChange={(e) => onChange({ payment_bank_account_number: e.target.value })}
            />
          </div>
        </div>
      </Row>
    </div>
  );
}
