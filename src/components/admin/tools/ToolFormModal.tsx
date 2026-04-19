import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Tool, emptyTool, TOKEN_BURN_OPTIONS } from "./types";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial: (Tool & { id: string }) | null;
}

export function ToolFormModal({ open, onOpenChange, initial }: Props) {
  const qc = useQueryClient();
  const [form, setForm] = useState<Tool>(emptyTool);
  const [useCasesText, setUseCasesText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      const init = initial ?? emptyTool;
      setForm(init);
      setUseCasesText((init.use_cases ?? []).join("\n"));
    }
  }, [open, initial]);

  const set = <K extends keyof Tool>(k: K, v: Tool[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description || null,
      github_url: form.github_url || null,
      install_instructions: form.install_instructions || null,
      installed: form.installed,
      installed_at: form.installed && !form.installed_at ? new Date().toISOString() : form.installed_at,
      license: form.license || null,
      monthly_cost_usd: Number(form.monthly_cost_usd) || 0,
      notes: form.notes || null,
      priority_rank: Number(form.priority_rank) || 5,
      revenue_potential_php: Number(form.revenue_potential_php) || 0,
      token_burn: form.token_burn || "low",
      use_cases: useCasesText.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    const q = initial?.id
      ? supabase.from("tools").update(payload).eq("id", initial.id)
      : supabase.from("tools").insert(payload);
    const { error } = await q;
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(initial?.id ? "Tool updated" : "Tool added");
    qc.invalidateQueries({ queryKey: ["tools"] });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial?.id ? "Edit Tool" : "New Tool"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g., Lovable AI Gateway" />
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={2} />
            </div>
            <div>
              <Label>GitHub / Docs URL</Label>
              <Input value={form.github_url ?? ""} onChange={(e) => set("github_url", e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <Label>License</Label>
              <Input value={form.license ?? ""} onChange={(e) => set("license", e.target.value)} placeholder="MIT, GPL, Commercial..." />
            </div>
            <div>
              <Label>Monthly Cost (USD)</Label>
              <Input type="number" value={form.monthly_cost_usd ?? 0} onChange={(e) => set("monthly_cost_usd", Number(e.target.value))} />
            </div>
            <div>
              <Label>Revenue Potential (PHP)</Label>
              <Input type="number" value={form.revenue_potential_php ?? 0} onChange={(e) => set("revenue_potential_php", Number(e.target.value))} />
            </div>
            <div>
              <Label>Priority Rank (1-10)</Label>
              <Input type="number" min={1} max={10} value={form.priority_rank ?? 5} onChange={(e) => set("priority_rank", Number(e.target.value))} />
            </div>
            <div>
              <Label>Token Burn</Label>
              <Select value={form.token_burn ?? "low"} onValueChange={(v) => set("token_burn", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TOKEN_BURN_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>Use Cases (one per line)</Label>
              <Textarea value={useCasesText} onChange={(e) => setUseCasesText(e.target.value)} rows={3} placeholder="Resort booking pages&#10;Restaurant menus" />
            </div>
            <div className="sm:col-span-2">
              <Label>Install Instructions</Label>
              <Textarea value={form.install_instructions ?? ""} onChange={(e) => set("install_instructions", e.target.value)} rows={3} />
            </div>
            <div className="sm:col-span-2">
              <Label>Notes</Label>
              <Textarea value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} rows={2} />
            </div>
            <div className="sm:col-span-2 flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="cursor-pointer">Installed</Label>
                <p className="text-xs text-muted-foreground">Mark as currently in use</p>
              </div>
              <Switch checked={form.installed} onCheckedChange={(v) => set("installed", v)} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
