import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X, FileText, Loader2, Image as ImageIcon } from "lucide-react";
import { CATEGORY_OPTIONS, PAYMENT_METHOD_OPTIONS, type ExpenseRow } from "./types";
import { convertToPHP, formatCurrency, type Currency } from "@/lib/currency";

type Client = { id: string; business_name: string };
type Project = { id: string; name: string };
type Quote = { id: string; title: string; invoice_number: string | null };

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: ExpenseRow | null;
  onSaved: (keepOpen?: boolean) => void;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

const emptyForm = {
  expense_name: "",
  description: "",
  category: "miscellaneous",
  amount: 0,
  tax_amount: 0,
  currency: "PHP",
  expense_date: todayISO(),
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
  quote_id: "",
  status: "approved",
  approved_by: "",
  notes: "",
  notes_customer: "",
  tags: "",
  receipt_path: "",
  receipt_url: "",
  no_receipt: false,
};

const MAX_RECEIPT_SIZE = 5 * 1024 * 1024;

export default function ExpenseFormModal({ open, onOpenChange, expense, onSaved }: Props) {
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [receiptFileMeta, setReceiptFileMeta] = useState<{ name: string; size: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    Promise.all([
      supabase.from("clients").select("id,business_name").order("business_name"),
      supabase.from("projects").select("id,name").order("name"),
      supabase.from("quotes").select("id,title,invoice_number").order("created_at", { ascending: false }),
    ]).then(([c, p, q]) => {
      setClients((c.data as Client[]) ?? []);
      setProjects((p.data as Project[]) ?? []);
      setQuotes((q.data as Quote[]) ?? []);
    });

    setErrors({});
    setReceiptFileMeta(null);

    if (expense) {
      setForm({
        ...emptyForm,
        expense_name: expense.expense_name ?? "",
        description: expense.description ?? "",
        category: expense.category ?? "miscellaneous",
        amount: Number(expense.amount) || 0,
        tax_amount: 0,
        currency: expense.currency ?? "PHP",
        expense_date: expense.expense_date ?? todayISO(),
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
        quote_id: expense.quote_id ?? "",
        status: expense.status ?? "approved",
        approved_by: expense.approved_by ?? "",
        notes: expense.notes ?? "",
        notes_customer: "",
        tags: (expense.tags ?? []).join(", "),
        receipt_path: expense.receipt_path ?? "",
        receipt_url: expense.receipt_url ?? "",
        no_receipt: !expense.receipt_url,
      });
    } else {
      setForm({ ...emptyForm });
    }
  }, [open, expense]);

  const upd = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const totalAmount = Number(form.amount || 0) + Number(form.tax_amount || 0);
  const phpEquivalent =
    form.currency === "PHP"
      ? totalAmount
      : Number(convertToPHP(totalAmount, form.currency as Currency).toFixed(2));

  const handleReceiptUpload = async (file: File) => {
    if (!["image/png", "image/jpeg", "image/jpg", "application/pdf"].includes(file.type)) {
      return toast.error("Only PNG, JPG, or PDF allowed");
    }
    if (file.size > MAX_RECEIPT_SIZE) return toast.error("File too large (max 5MB)");

    setUploading(true);
    try {
      // remove existing if replacing
      if (form.receipt_path) {
        await supabase.storage.from("receipts").remove([form.receipt_path]);
      }
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("receipts").upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("receipts").getPublicUrl(path);
      upd("receipt_path", path);
      upd("receipt_url", data.publicUrl);
      upd("no_receipt", false);
      setReceiptFileMeta({ name: file.name, size: file.size });
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
    setReceiptFileMeta(null);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.expense_name.trim() || form.expense_name.trim().length < 3) e.expense_name = "Min 3 characters";
    if (!form.category) e.category = "Required";
    if (!form.amount || form.amount <= 0) e.amount = "Must be > 0";
    if (!form.expense_date) e.expense_date = "Required";
    else if (form.expense_date > todayISO()) e.expense_date = "Cannot be in the future";
    if (form.is_recurring && !form.next_recurring_date) e.next_recurring_date = "Required for recurring";
    if (form.status === "approved" && expense?.status !== "approved" && !form.approved_by.trim() && !expense) {
      // soft check; allow empty
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (addAnother = false) => {
    if (!validate()) return toast.error("Please fix the highlighted fields");

    setSaving(true);
    const payload: any = {
      expense_name: form.expense_name.trim(),
      description: form.description || null,
      category: form.category,
      amount: totalAmount,
      currency: form.currency,
      amount_php: phpEquivalent,
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
      client_id: form.is_billable && form.client_id ? form.client_id : null,
      project_id: form.is_billable && form.project_id ? form.project_id : null,
      quote_id: form.is_billable && form.quote_id ? form.quote_id : null,
      status: form.status,
      approved_by: form.status === "approved" && form.approved_by ? form.approved_by : null,
      approved_at: form.status === "approved" ? new Date().toISOString() : null,
      notes: form.notes || null,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      receipt_path: form.no_receipt ? null : form.receipt_path || null,
      receipt_url: form.no_receipt ? null : form.receipt_url || null,
    };

    const res = expense
      ? await supabase.from("expenses").update(payload).eq("id", expense.id)
      : await supabase.from("expenses").insert(payload);

    setSaving(false);
    if (res.error) return toast.error("Save failed: " + res.error.message);
    toast.success(expense ? "Expense updated" : "Expense added");

    if (addAnother && !expense) {
      onSaved(true);
      setForm({ ...emptyForm });
      setReceiptFileMeta(null);
      return;
    }
    onSaved();
    onOpenChange(false);
  };

  const fmtSize = (b: number) => (b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`);
  const isImageReceipt = form.receipt_url && /\.(png|jpe?g|gif|webp)(\?|$)/i.test(form.receipt_url);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{expense ? "Edit Expense" : "Add Expense"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* SECTION 1: Basic */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Basic information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs">Expense Name *</Label>
                <Input value={form.expense_name} onChange={(e) => upd("expense_name", e.target.value)} placeholder="e.g. Adobe CC subscription" />
                {errors.expense_name && <p className="text-[10px] text-rose-400">{errors.expense_name}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Category *</Label>
                <Select value={form.category} onValueChange={(v) => upd("category", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORY_OPTIONS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
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
                <Label className="text-xs">Tags (comma-separated)</Label>
                <Input value={form.tags} onChange={(e) => upd("tags", e.target.value)} placeholder="travel, urgent" />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs">Description</Label>
                <Textarea rows={2} value={form.description} onChange={(e) => upd("description", e.target.value)} />
              </div>
            </div>
          </section>

          {/* SECTION 2: Amount */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Amount & currency</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Amount *</Label>
                <Input type="number" step="0.01" value={form.amount} onChange={(e) => upd("amount", Number(e.target.value))} />
                {errors.amount && <p className="text-[10px] text-rose-400">{errors.amount}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tax</Label>
                <Input type="number" step="0.01" value={form.tax_amount} onChange={(e) => upd("tax_amount", Number(e.target.value))} />
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
            </div>
            <div className="rounded-lg border border-border/40 bg-muted/20 px-3 py-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total {form.currency !== "PHP" && "(₱ equivalent)"}</span>
              <span className="font-semibold tabular-nums">
                {form.currency === "PHP"
                  ? formatCurrency(totalAmount, "PHP")
                  : `${totalAmount.toFixed(2)} ${form.currency} ≈ ${formatCurrency(phpEquivalent, "PHP")}`}
              </span>
            </div>
          </section>

          {/* SECTION 3: Date & Type */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Date & type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Expense Date *</Label>
                <Input type="date" max={todayISO()} value={form.expense_date} onChange={(e) => upd("expense_date", e.target.value)} />
                {errors.expense_date && <p className="text-[10px] text-rose-400">{errors.expense_date}</p>}
              </div>
              <label className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2 self-end">
                <span className="text-xs">Recurring</span>
                <Switch checked={form.is_recurring} onCheckedChange={(v) => upd("is_recurring", v)} />
              </label>
              {form.is_recurring && (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Frequency</Label>
                    <Select value={form.recurring_frequency} onValueChange={(v) => upd("recurring_frequency", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Next Date *</Label>
                    <Input type="date" value={form.next_recurring_date} onChange={(e) => upd("next_recurring_date", e.target.value)} />
                    {errors.next_recurring_date && <p className="text-[10px] text-rose-400">{errors.next_recurring_date}</p>}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* SECTION 4: Payment */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Payment</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Payment Method</Label>
                <Select value={form.payment_method} onValueChange={(v) => upd("payment_method", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PAYMENT_METHOD_OPTIONS.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Payment Reference</Label>
                <Input value={form.payment_reference} onChange={(e) => upd("payment_reference", e.target.value)} placeholder="Transaction / check #" />
              </div>
            </div>
          </section>

          {/* SECTION 5: Receipt */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Receipt</h3>
            <label className="flex items-center gap-2 text-xs">
              <Checkbox checked={form.no_receipt} onCheckedChange={(v) => { upd("no_receipt", !!v); if (v) removeReceipt(); }} />
              <span>No receipt (cash expense without receipt)</span>
            </label>

            {!form.no_receipt && (
              <>
                {form.receipt_url ? (
                  <div className="flex items-start gap-3 rounded-lg border border-border/40 p-3">
                    <div className="shrink-0">
                      {isImageReceipt ? (
                        <img src={form.receipt_url} alt="receipt" className="w-16 h-16 object-cover rounded border border-border/40" />
                      ) : (
                        <div className="w-16 h-16 rounded border border-border/40 flex items-center justify-center bg-muted/40">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <a href={form.receipt_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate block">
                        View receipt
                      </a>
                      {receiptFileMeta && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">{receiptFileMeta.name} • {fmtSize(receiptFileMeta.size)}</p>
                      )}
                      <div className="flex gap-1 mt-2">
                        <label className="text-[11px] text-primary hover:underline cursor-pointer">
                          Replace
                          <input
                            type="file"
                            accept="image/png,image/jpeg,application/pdf"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleReceiptUpload(e.target.files[0])}
                          />
                        </label>
                        <button onClick={removeReceipt} className="text-[11px] text-rose-400 hover:underline ml-3">Delete</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 px-3 py-6 cursor-pointer hover:bg-muted/30 transition">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span className="text-xs text-muted-foreground">{uploading ? "Uploading…" : "Upload receipt — PNG, JPG, PDF (max 5MB)"}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,application/pdf"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleReceiptUpload(e.target.files[0])}
                    />
                  </label>
                )}
              </>
            )}
          </section>

          {/* SECTION 6: Classification */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Classification</h3>
            <label className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2">
              <span className="text-xs">Billable to client</span>
              <Switch checked={form.is_billable} onCheckedChange={(v) => upd("is_billable", v)} />
            </label>

            {form.is_billable && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                <div className="space-y-1.5">
                  <Label className="text-xs">Link to Quote</Label>
                  <Select value={form.quote_id || "none"} onValueChange={(v) => upd("quote_id", v === "none" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">— None —</SelectItem>
                      {quotes.map((q) => <SelectItem key={q.id} value={q.id}>{q.invoice_number ? `${q.invoice_number} — ` : ""}{q.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Status</Label>
                <Select value={form.status} onValueChange={(v) => upd("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.status === "approved" && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Approved by</Label>
                  <Input value={form.approved_by} onChange={(e) => upd("approved_by", e.target.value)} placeholder="Approver name" />
                </div>
              )}
            </div>
          </section>

          {/* SECTION 7: Notes */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Notes</h3>
            <div className="space-y-1.5">
              <Label className="text-xs">Internal notes</Label>
              <Textarea rows={2} value={form.notes} onChange={(e) => upd("notes", e.target.value)} placeholder="Visible only in admin" />
            </div>
          </section>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          {!expense && (
            <Button variant="outline" onClick={() => handleSave(true)} disabled={saving}>
              Save & Add Another
            </Button>
          )}
          <Button onClick={() => handleSave(false)} disabled={saving}>
            {saving ? "Saving…" : expense ? "Save Changes" : "Save Expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
