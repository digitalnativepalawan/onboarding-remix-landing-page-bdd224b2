import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PROJECT_STAGES } from "./types";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: any | null;
}

const empty = {
  name: "",
  description: "",
  category: "",
  stage: "idea",
  github_url: "",
  lovable_url: "",
  vercel_url: "",
  live_url: "",
  budget_php: 0,
  actual_cost_php: 0,
  start_date: null as string | null,
  target_launch: null as string | null,
  actual_launch: null as string | null,
  notes: "",
  tech_stack: [] as string[],
  team_members: [] as string[],
};

export function ProjectFormModal({ open, onOpenChange, initial }: Props) {
  const qc = useQueryClient();
  const [form, setForm] = useState<any>(empty);
  const [techInput, setTechInput] = useState("");
  const [teamInput, setTeamInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...empty, ...initial, tech_stack: initial.tech_stack || [], team_members: initial.team_members || [] } : empty);
      setTechInput((initial?.tech_stack || []).join(", "));
      setTeamInput((initial?.team_members || []).join(", "));
    }
  }, [open, initial]);

  const save = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    setSaving(true);
    try {
      const payload = {
        ...form,
        budget_php: Number(form.budget_php) || 0,
        actual_cost_php: Number(form.actual_cost_php) || 0,
        tech_stack: techInput.split(",").map((s) => s.trim()).filter(Boolean),
        team_members: teamInput.split(",").map((s) => s.trim()).filter(Boolean),
      };
      delete payload.id;
      if (form.id) {
        const { error } = await supabase.from("projects").update(payload).eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
      }
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit Project" : "New Project"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-3">
          <div className="space-y-3 py-2">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Resort, SaaS, Tool" />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea rows={2} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div>
              <Label>Stage</Label>
              <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROJECT_STAGES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label>GitHub URL</Label><Input value={form.github_url ?? ""} onChange={(e) => setForm({ ...form, github_url: e.target.value })} /></div>
              <div><Label>Lovable URL</Label><Input value={form.lovable_url ?? ""} onChange={(e) => setForm({ ...form, lovable_url: e.target.value })} /></div>
              <div><Label>Vercel URL</Label><Input value={form.vercel_url ?? ""} onChange={(e) => setForm({ ...form, vercel_url: e.target.value })} /></div>
              <div><Label>Live URL</Label><Input value={form.live_url ?? ""} onChange={(e) => setForm({ ...form, live_url: e.target.value })} /></div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label>Budget (₱)</Label><Input type="number" min={0} value={form.budget_php} onChange={(e) => setForm({ ...form, budget_php: e.target.value })} /></div>
              <div><Label>Actual Cost (₱)</Label><Input type="number" min={0} value={form.actual_cost_php} onChange={(e) => setForm({ ...form, actual_cost_php: e.target.value })} /></div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div><Label>Start</Label><Input type="date" value={form.start_date ?? ""} onChange={(e) => setForm({ ...form, start_date: e.target.value || null })} /></div>
              <div><Label>Target Launch</Label><Input type="date" value={form.target_launch ?? ""} onChange={(e) => setForm({ ...form, target_launch: e.target.value || null })} /></div>
              <div><Label>Actual Launch</Label><Input type="date" value={form.actual_launch ?? ""} onChange={(e) => setForm({ ...form, actual_launch: e.target.value || null })} /></div>
            </div>

            <div>
              <Label>Tech Stack <span className="text-xs text-muted-foreground">(comma-separated)</span></Label>
              <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="React, Supabase, Tailwind" />
            </div>
            <div>
              <Label>Team Members <span className="text-xs text-muted-foreground">(comma-separated)</span></Label>
              <Input value={teamInput} onChange={(e) => setTeamInput(e.target.value)} placeholder="Alex, Maria" />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea rows={3} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
