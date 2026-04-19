import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { REVENUE_TYPES, REVENUE_STATUSES } from "./types";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: any | null;
}

const empty = {
  client_id: null as string | null,
  amount_php: 0,
  type: "setup",
  status: "pending",
  payment_date: null as string | null,
  notes: "",
};

export function RevenueFormModal({ open, onOpenChange, initial }: Props) {
  const qc = useQueryClient();
  const [form, setForm] = useState<any>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(initial ? { ...initial } : empty);
  }, [open, initial]);

  const { data: clients = [] } = useQuery({
    queryKey: ["revenue-clients"],
    queryFn: async () => {
      const { data } = await supabase.from("clients").select("id,business_name").order("business_name");
      return data ?? [];
    },
  });

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        client_id: form.client_id,
        amount_php: Number(form.amount_php) || 0,
        type: form.type,
        status: form.status,
        payment_date: form.payment_date || null,
        notes: form.notes,
      };
      if (form.id) {
        const { error } = await supabase.from("revenue").update(payload).eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("revenue").insert(payload);
        if (error) throw error;
      }
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["revenue"] });
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit Revenue" : "Record Revenue"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Client</Label>
            <Select value={form.client_id ?? ""} onValueChange={(v) => setForm({ ...form, client_id: v })}>
              <SelectTrigger><SelectValue placeholder="Select client (optional)" /></SelectTrigger>
              <SelectContent>
                {clients.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.business_name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Amount (₱)</Label>
              <Input type="number" min={0} value={form.amount_php} onChange={(e) => setForm({ ...form, amount_php: e.target.value })} />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REVENUE_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REVENUE_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Payment Date</Label>
              <Input type="date" value={form.payment_date ?? ""} onChange={(e) => setForm({ ...form, payment_date: e.target.value || null })} />
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea rows={3} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
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
