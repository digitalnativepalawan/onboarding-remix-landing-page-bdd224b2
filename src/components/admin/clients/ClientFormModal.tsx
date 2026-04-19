import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Client, PIPELINE_STAGES, SERVICE_INTERESTS, SOURCES } from "./types";

interface Props {
  open: boolean;
  onClose: () => void;
  client: Client | null;
  onSaved: () => void;
}

const empty = {
  business_name: "",
  contact_name: "",
  whatsapp: "",
  email: "",
  location: "",
  facebook_url: "",
  business_type: "",
  source: "",
  pipeline_stage: "prospect",
  service_interests: [] as string[],
  estimated_value_php: 0,
  monthly_recurring_php: 0,
  last_contact_date: "",
  follow_up_date: "",
  pitch_sent_date: "",
  notes: "",
};

export function ClientFormModal({ open, onClose, client, onSaved }: Props) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (client) {
      setForm({
        business_name: client.business_name || "",
        contact_name: client.contact_name || "",
        whatsapp: client.whatsapp || "",
        email: client.email || "",
        location: client.location || "",
        facebook_url: client.facebook_url || "",
        business_type: client.business_type || "",
        source: client.source || "",
        pipeline_stage: client.pipeline_stage || "prospect",
        service_interests: client.service_interests || [],
        estimated_value_php: Number(client.estimated_value_php || 0),
        monthly_recurring_php: Number(client.monthly_recurring_php || 0),
        last_contact_date: client.last_contact_date || "",
        follow_up_date: client.follow_up_date || "",
        pitch_sent_date: client.pitch_sent_date || "",
        notes: client.notes || "",
      });
    } else {
      setForm(empty);
    }
  }, [client, open]);

  const toggleInterest = (s: string) => {
    setForm((f) => ({
      ...f,
      service_interests: f.service_interests.includes(s)
        ? f.service_interests.filter((x) => x !== s)
        : [...f.service_interests, s],
    }));
  };

  const handleSave = async () => {
    if (!form.business_name.trim()) {
      toast.error("Business name is required");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      source: form.source || null,
      last_contact_date: form.last_contact_date || null,
      follow_up_date: form.follow_up_date || null,
      pitch_sent_date: form.pitch_sent_date || null,
    };
    const { error } = client
      ? await supabase.from("clients").update(payload).eq("id", client.id)
      : await supabase.from("clients").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(client ? "Client updated" : "Client added");
    onSaved();
    onClose();
  };

  const handleDelete = async () => {
    if (!client) return;
    const { error } = await supabase.from("clients").delete().eq("id", client.id);
    if (error) return toast.error(error.message);
    toast.success("Client deleted");
    onSaved();
    onClose();
    setConfirmDelete(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{client ? "Edit client" : "New client"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-2">
            <div className="md:col-span-2 space-y-1.5">
              <Label>Business name *</Label>
              <Input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} />
            </div>

            <div className="space-y-1.5">
              <Label>Contact name</Label>
              <Input value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Business type</Label>
              <Input value={form.business_type} onChange={(e) => setForm({ ...form, business_type: e.target.value })} placeholder="Resort, Restaurant…" />
            </div>

            <div className="space-y-1.5">
              <Label>WhatsApp</Label>
              <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="El Nido, San Vicente…" />
            </div>
            <div className="space-y-1.5">
              <Label>Facebook URL</Label>
              <Input value={form.facebook_url} onChange={(e) => setForm({ ...form, facebook_url: e.target.value })} />
            </div>

            <div className="space-y-1.5">
              <Label>Pipeline stage</Label>
              <Select value={form.pipeline_stage} onValueChange={(v) => setForm({ ...form, pipeline_stage: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PIPELINE_STAGES.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>How they found us</Label>
              <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
                <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                <SelectContent>
                  {SOURCES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Estimated value (₱)</Label>
              <Input type="number" min={0} value={form.estimated_value_php}
                onChange={(e) => setForm({ ...form, estimated_value_php: Number(e.target.value) })} />
            </div>
            <div className="space-y-1.5">
              <Label>Monthly recurring (₱)</Label>
              <Input type="number" min={0} value={form.monthly_recurring_php}
                onChange={(e) => setForm({ ...form, monthly_recurring_php: Number(e.target.value) })} />
            </div>

            <div className="space-y-1.5">
              <Label>Last contact</Label>
              <Input type="date" value={form.last_contact_date}
                onChange={(e) => setForm({ ...form, last_contact_date: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Follow-up date</Label>
              <Input type="date" value={form.follow_up_date}
                onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Pitch sent</Label>
              <Input type="date" value={form.pitch_sent_date}
                onChange={(e) => setForm({ ...form, pitch_sent_date: e.target.value })} />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <Label>Service interests</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 border border-border rounded-md">
                {SERVICE_INTERESTS.map((s) => (
                  <label key={s} className="flex items-center gap-2 text-xs cursor-pointer">
                    <Checkbox
                      checked={form.service_interests.includes(s)}
                      onCheckedChange={() => toggleInterest(s)}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <Label>Notes</Label>
              <Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>

          <DialogFooter className="flex sm:justify-between">
            {client ? (
              <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            ) : <span />}
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this client?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {client?.business_name} and all their notes. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
