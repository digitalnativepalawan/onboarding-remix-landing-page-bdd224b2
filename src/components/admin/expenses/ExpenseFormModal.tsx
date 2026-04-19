import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { CATEGORY_OPTIONS, PAYMENT_METHOD_OPTIONS, type ExpenseRow } from "./types";
import { convertToPHP, type Currency } from "@/lib/currency";

type Client = { id: string; business_name: string };
type Project = { id: string; name: string };

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: ExpenseRow | null;
  onSaved: () => void;
}

const emptyForm = {
  expense_name: "",
  description: "",
  category: "miscellaneous",
  amount: 0,
  currency: "PHP",
  expense_date: new Date().toISOString().slice(0, 10),
  payment_method: "cash",
  payment_reference: "",
  vendor_name: "",
  invoice_number: "",
  expense_type: "one_time",
  is_billable: false,
  is_recurring: false,
  recurring_frequency: "monthly",
  next_recurring_date: "",
  client_id: "",
  project_id: "",
  status: "approved",
  notes: "",
  tags: "",
  receipt_path: "",
  receipt_url: "",
};

export default function ExpenseFormModal({ open, onOpenChange, expense, onSaved }: Props) {
  const [form, setForm] = useState({ ...emptyForm });
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    Promise.all([
      supabase.from("clients").select("id,business_name").order("business_name"),
      supabase.from("projects").select("id,name").order("name"),
    ]).then(([c, p]) => {
      setClients((c.data as Client[]) ?? []);
      setProjects((p.data as Project[]) ?? []);
    });

    if (expense) {
      setForm({
        expense_name: expense.expense_name ?? "",
        description: expense.description ?? "",
        category: expense.category ?? "miscellaneous",
        amount: Number(expense.amount) || 0,
        currency: expense.currency ?? "PHP",
        expense_date: expense.expense_date ?? new Date().toISOString().slice(0, 10),
        payment_method: expense.payment_method ?? "cash",
        payment_reference: expense.payment_reference ?? "",
        vendor_name: expense.vendor_name ?? "",
        invoice_number: expense.invoice_number ?? "",
        expense_type: expense.expense_type ?? "one_time",
        is_billable: !!expense.is_billable,
        is_recurring: !!expense.is_recurring,
        recurring_frequency: expense.recurring_frequency ?? "monthly",
        next_recurring_date: expense.next_recurring_date ?? "",
        client_id: expense.client_id ?? "",
        project_id: expense.project_id ?? "",
        status: expense.status ?? "approved",
        notes: expense.notes ?? "",
        tags: (expense.tags ?? []).join(", "),
        receipt_path: expense.receipt_path ?? "",
        receipt_url: expense.receipt_url ?? "",
      });
    } else {
      setForm({ ...emptyForm });
    }
  }, [open, expense]);

  const upd = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleReceiptUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("receipts").upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("receipts").getPublicUrl(path);
      upd("receipt_path", path);
      upd("receipt_url", data.publicUrl);
      toast.success("Receipt uploaded");
    } catch (e: any) {
      toast.error("Upload failed: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  const removeReceipt = async () => {
    if (form.receipt_path) {
      await supabase.storage.from("receipts").remove([form.receipt_path]);
    }
    upd("receipt_path", "");
    upd("receipt_url", "");
  };

  const handleSave = async () => {
    if (!form.expense_name.trim()) return toast.error("Expense name is required");
    if (!form.amount || form.amount <= 0) return toast.error("Amount must be greater than 0");

    setSaving(true);
    const amount_php =
      form.currency === "PHP"
        ? Number(form.amount)
        : Number(convertToPHP(Number(form.amount), form.currency as Currency).toFixed(2));

    const payload: any = {
      expense_name: form.expense_name.trim(),
      description: form.description || null,
      category: form.category,
      amount: Number(form.amount),
      currency: form.currency,
      amount_php,
      expense_date: form.expense_date,
      payment_method: form.payment_method || null,
      payment_reference: form.payment_reference || null,
      vendor_name: form.vendor_name || null,
      invoice_number: form.invoice_number || null,
      expense_type: form.is_recurring ? "recurring" : "one_time",
      is_billable: form.is_billable,
      is_recurring: form.is_recurring,
      recurring_frequency: form.is_recurring ? form.recurring_frequency : null,
      next_recurring_date: form.is_recurring && form.next_recurring_date ? form.next_recurring_date : null,
      client_id: form.client_id || null,
      project_id: form.project_id || null,
      status: form.status,
      notes: form.notes || null,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      receipt_path: form.receipt_path || null,
      receipt_url: form.receipt_url || null,
    };

    const res = expense
      ? await supabase.from("expenses").update(payload).eq("id", expense.id)
      : await supabase.from("expenses").insert(payload);

    setSaving(false);
    if (res.error) return toast.error("Save failed: " + res.error.message);
    toast.success(expense ? "Expense updated" : "Expense added");
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{expense ? "Edit Expense" : "Add Expense"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Expense Name *</Label>
            <Input value={form.expense_name} onChange={(e) => upd("expense_name", e.target.value)} placeholder="e.g. Adobe CC subscription" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Category *</Label>
            <Select value={form.category} onValueChange={(v) => upd("category", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORY_OPTIONS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Date *</Label>
            <Input type="date" value={form.expense_date} onChange={(e) => upd("expense_date", e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Amount *</Label>
            <Input type="number" step="0.01" value={form.amount} onChange={(e) => upd("amount", Number(e.target.value))} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Currency</Label>
            <Select value={form.currency} onValueChange={(v) => upd("currency", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="PHP">PHP — ₱</SelectItem>
                <SelectItem value="USD">USD — $</SelectItem>
                <SelectItem value="EUR">EUR — €</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Payment Method</Label>
            <Select value={form.payment_method} onValueChange={(v) => upd("payment_method", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{PAYMENT_METHOD_OPTIONS.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Payment Reference</Label>
            <Input value={form.payment_reference} onChange={(e) => upd("payment_reference", e.target.value)} placeholder="Transaction ID" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Vendor</Label>
            <Input value={form.vendor_name} onChange={(e) => upd("vendor_name", e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Invoice #</Label>
            <Input value={form.invoice_number} onChange={(e) => upd("invoice_number", e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Client</Label>
            <Select value={form.client_id || "none"} onValueChange={(v) => upd("client_id", v === "none" ? "" : v)}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— None —</SelectItem>
                {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.business_name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Project</Label>
            <Select value={form.project_id || "none"} onValueChange={(v) => upd("project_id", v === "none" ? "" : v)}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— None —</SelectItem>
                {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2 grid grid-cols-2 gap-3">
            <label className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2">
              <span className="text-xs">Billable to client</span>
              <Switch checked={form.is_billable} onCheckedChange={(v) => upd("is_billable", v)} />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2">
              <span className="text-xs">Recurring</span>
              <Switch checked={form.is_recurring} onCheckedChange={(v) => upd("is_recurring", v)} />
            </label>
          </div>

          {form.is_recurring && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">Frequency</Label>
                <Select value={form.recurring_frequency} onValueChange={(v) => upd("recurring_frequency", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Next Date</Label>
                <Input type="date" value={form.next_recurring_date} onChange={(e) => upd("next_recurring_date", e.target.value)} />
              </div>
            </>
          )}

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Tags (comma-separated)</Label>
            <Input value={form.tags} onChange={(e) => upd("tags", e.target.value)} placeholder="travel, urgent" />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Notes</Label>
            <Textarea rows={2} value={form.notes} onChange={(e) => upd("notes", e.target.value)} />
          </div>

          {/* Receipt */}
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Receipt</Label>
            {form.receipt_url ? (
              <div className="flex items-center gap-2 rounded-lg border border-border/40 px-3 py-2">
                <FileText className="w-4 h-4 text-primary shrink-0" />
                <a href={form.receipt_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate flex-1">View receipt</a>
                <Button size="sm" variant="ghost" onClick={removeReceipt}><X className="w-3.5 h-3.5" /></Button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 px-3 py-4 cursor-pointer hover:bg-muted/30 transition">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span className="text-xs text-muted-foreground">{uploading ? "Uploading…" : "Upload receipt (image or PDF)"}</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleReceiptUpload(e.target.files[0])}
                />
              </label>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save Expense"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
