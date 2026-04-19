import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings2, Building2, Image as ImageIcon, Palette, Phone, Share2, Save, RotateCcw, ExternalLink } from "lucide-react";
import LogoUploader from "@/components/admin/site-settings/LogoUploader";
import ColorPicker from "@/components/admin/site-settings/ColorPicker";
import ColorPreview from "@/components/admin/site-settings/ColorPreview";
import FooterPreview from "@/components/admin/site-settings/FooterPreview";
import AdminSettingsModal from "@/components/landing/AdminSettingsModal";
import { DEFAULT_COLORS, type SiteSettingsRow } from "@/components/admin/site-settings/types";

const EMPTY: SiteSettingsRow = {
  id: "default",
  logo_main_url: null, logo_light_url: null, logo_dark_url: null, favicon_url: null,
  company_name: "", tagline: "", address_line: "", city: "", province: "",
  postal_code: "", country: "", copyright_holder: "",
  contact_email: "", contact_phone: "", contact_whatsapp: "",
  color_primary: DEFAULT_COLORS.primary, color_secondary: DEFAULT_COLORS.secondary, color_accent: DEFAULT_COLORS.accent,
  social_facebook: "", social_instagram: "", social_twitter: "", social_linkedin: "", social_youtube: "", social_tiktok: "",
};

const SectionCard = ({ icon: Icon, title, description, children }: {
  icon: typeof Settings2; title: string; description?: string; children: React.ReactNode;
}) => (
  <section className="rounded-xl border border-border/40 bg-card p-4 sm:p-5">
    <div className="flex items-start gap-3 mb-4">
      <div className="rounded-lg bg-primary/10 p-2 shrink-0"><Icon className="w-4 h-4 text-primary" /></div>
      <div className="min-w-0">
        <h2 className="text-sm font-semibold">{title}</h2>
        {description && <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </div>
    {children}
  </section>
);

export default function SiteSettingsPage() {
  const [s, setS] = useState<SiteSettingsRow>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [legacyOpen, setLegacyOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", "default").maybeSingle();
    if (error) toast.error("Failed to load settings");
    if (data) setS({ ...EMPTY, ...(data as Partial<SiteSettingsRow>) });
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const update = <K extends keyof SiteSettingsRow>(key: K, value: SiteSettingsRow[K]) =>
    setS((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    const { id, ...rest } = s;
    const { error } = await supabase
      .from("site_settings")
      .update({ ...rest, updated_at: new Date().toISOString() })
      .eq("id", "default");
    if (error) toast.error("Save failed: " + error.message);
    else toast.success("Settings saved");
    setSaving(false);
  };

  const resetColors = () => {
    update("color_primary", DEFAULT_COLORS.primary);
    update("color_secondary", DEFAULT_COLORS.secondary);
    update("color_accent", DEFAULT_COLORS.accent);
  };

  if (loading) {
    return <div className="text-xs text-muted-foreground">Loading site settings…</div>;
  }

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header / Save bar */}
      <div className="rounded-xl border border-border/40 bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 shrink-0"><Settings2 className="w-5 h-5 text-primary" /></div>
          <div className="min-w-0">
            <h1 className="text-base font-semibold">Website Settings</h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">Public-facing identity, branding, and contact info.</p>
          </div>
        </div>
        <Button onClick={save} disabled={saving} size="sm" className="w-full sm:w-auto">
          <Save className="w-3.5 h-3.5 mr-1.5" /> {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>

      {/* Company info */}
      <SectionCard icon={Building2} title="Company Information" description="Used in footer, invoices, and meta tags.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Company Name</Label>
            <Input value={s.company_name ?? ""} onChange={(e) => update("company_name", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Tagline</Label>
            <Input value={s.tagline ?? ""} onChange={(e) => update("tagline", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Business Address</Label>
            <Textarea rows={2} value={s.address_line ?? ""} onChange={(e) => update("address_line", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">City</Label>
            <Input value={s.city ?? ""} onChange={(e) => update("city", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Province / State</Label>
            <Input value={s.province ?? ""} onChange={(e) => update("province", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Postal Code</Label>
            <Input value={s.postal_code ?? ""} onChange={(e) => update("postal_code", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Country</Label>
            <Input value={s.country ?? ""} onChange={(e) => update("country", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Copyright Holder</Label>
            <Input value={s.copyright_holder ?? ""} onChange={(e) => update("copyright_holder", e.target.value)} />
          </div>
        </div>
      </SectionCard>

      {/* Contact */}
      <SectionCard icon={Phone} title="Contact Channels">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Email</Label>
            <Input type="email" value={s.contact_email ?? ""} onChange={(e) => update("contact_email", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Phone</Label>
            <Input value={s.contact_phone ?? ""} onChange={(e) => update("contact_phone", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">WhatsApp</Label>
            <Input value={s.contact_whatsapp ?? ""} onChange={(e) => update("contact_whatsapp", e.target.value)} />
          </div>
        </div>
      </SectionCard>

      {/* Branding & Logos */}
      <SectionCard icon={ImageIcon} title="Branding & Logos" description="All logos upload from your device to secure storage. No URLs needed.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <LogoUploader label="Main Logo" hint="Primary brand mark." fieldKey="main"
            currentUrl={s.logo_main_url} onChange={(url) => update("logo_main_url", url)} />
          <LogoUploader label="Logo for Dark Backgrounds" hint="White or light variant." fieldKey="dark"
            currentUrl={s.logo_dark_url} darkPreview onChange={(url) => update("logo_dark_url", url)} />
          <LogoUploader label="Logo for Light Backgrounds" hint="Black or dark variant." fieldKey="light"
            currentUrl={s.logo_light_url} onChange={(url) => update("logo_light_url", url)} />
          <LogoUploader label="Favicon" hint="32×32 or 64×64 PNG/ICO." fieldKey="favicon"
            currentUrl={s.favicon_url} onChange={(url) => update("favicon_url", url)} />
        </div>
      </SectionCard>

      {/* Brand colors */}
      <SectionCard icon={Palette} title="Brand Colors">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <ColorPicker label="Primary" value={s.color_primary || DEFAULT_COLORS.primary} onChange={(v) => update("color_primary", v)} />
          <ColorPicker label="Secondary" value={s.color_secondary || DEFAULT_COLORS.secondary} onChange={(v) => update("color_secondary", v)} />
          <ColorPicker label="Accent" value={s.color_accent || DEFAULT_COLORS.accent} onChange={(v) => update("color_accent", v)} />
        </div>
        <ColorPreview
          primary={s.color_primary || DEFAULT_COLORS.primary}
          secondary={s.color_secondary || DEFAULT_COLORS.secondary}
          accent={s.color_accent || DEFAULT_COLORS.accent}
        />
        <div className="mt-3">
          <Button size="sm" variant="ghost" onClick={resetColors}>
            <RotateCcw className="w-3 h-3 mr-1" /> Reset to default
          </Button>
        </div>
      </SectionCard>

      {/* Social */}
      <SectionCard icon={Share2} title="Social Media" description="Only icons with a URL appear in the footer.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {([
            ["social_facebook", "Facebook"],
            ["social_instagram", "Instagram"],
            ["social_twitter", "X / Twitter"],
            ["social_linkedin", "LinkedIn"],
            ["social_youtube", "YouTube"],
            ["social_tiktok", "TikTok"],
          ] as const).map(([key, label]) => (
            <div key={key} className="space-y-1.5">
              <Label className="text-xs">{label}</Label>
              <Input
                placeholder="https://…"
                value={(s[key] as string) ?? ""}
                onChange={(e) => update(key, e.target.value as never)}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Footer preview */}
      <SectionCard icon={Settings2} title="Footer Preview" description="Live preview reflecting your current settings.">
        <FooterPreview s={s} />
      </SectionCard>

      {/* Legacy content settings */}
      <SectionCard icon={ExternalLink} title="Landing Page Content"
        description="FAQs, header link, blog posts, featured apps, and feedback.">
        <Button size="sm" variant="outline" onClick={() => setLegacyOpen(true)}>
          Open content manager
        </Button>
        <AdminSettingsModal open={legacyOpen} onOpenChange={setLegacyOpen} />
      </SectionCard>

    </div>
  );
}
