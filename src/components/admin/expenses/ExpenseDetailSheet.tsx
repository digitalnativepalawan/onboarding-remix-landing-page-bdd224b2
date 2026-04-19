import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil, Trash2, Copy, Check, Download, FileText, Receipt as ReceiptIcon, Calendar, CreditCard, User, Folder, FileSignature, Tag } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { CATEGORY_COLORS, type ExpenseRow } from "./types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: ExpenseRow | null;
  onChanged: () => void;
  onEdit: (e: ExpenseRow) => void;
  onDuplicate: (e: ExpenseRow) => void;
}

const STATUS_COLORS: Record<string, string> = {
  approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  rejected: "bg-rose-500/15 text-rose-400 border-rose-500/30",
};

export default function ExpenseDetailSheet({ open, onOpenChange, expense, onChanged, onEdit, onDuplicate }: Props) {
  const [linkedClient, setLinkedClient] = useState<{ business_name: string } | null>(null);
  const [linkedProject, setLinkedProject] = useState<{ name: string } | null>(null);
  const [linkedQuote, setLinkedQuote] = useState<{ title: string; invoice_number: string | null } | null>(null);

  useEffect(() => {
    if (!open || !expense) return;
    setLinkedClient(null);
    setLinkedProject(null);
    setLinkedQuote(null);
    if (expense.client_id) supabase.from("clients").select("business_name").eq("id", expense.client_id).maybeSingle().then(({ data }) => setLinkedClient(data));
    if (expense.project_id) supabase.from("projects").select("name").eq("id", expense.project_id).maybeSingle().then(({ data }) => setLinkedProject(data));
    if (expense.quote_id) supabase.from("quotes").select("title,invoice_number").eq("id", expense.quote_id).maybeSingle().then(({ data }) => setLinkedQuote(data));
  }, [open, expense]);

  if (!expense) return null;

  const catColor = CATEGORY_COLORS[expense.category] ?? CATEGORY_COLORS.miscellaneous;
  const statusColor = STATUS_COLORS[expense.status] ?? STATUS_COLORS.pending;
  const isImage = expense.receipt_url && /\.(png|jpe?g|gif|webp)(\?|$)/i.test(expense.receipt_url);

  const handleDelete = async () => {
    if (!confirm("Delete this expense? This cannot be undone.")) return;
    if (expense.receipt_path) await supabase.storage.from("receipts").remove([expense.receipt_path]);
    const { error } = await supabase.from("expenses").delete().eq("id", expense.id);
    if (error) return toast.error("Delete failed");
    toast.success("Expense deleted");
    onChanged();
    onOpenChange(false);
  };

  const markAsPaid = async () => {
    const { error } = await supabase.from("expenses").update({ status: "approved", approved_at: new Date().toISOString() }).eq("id", expense.id);
    if (error) return toast.error("Update failed");
    toast.success("Marked as approved");
    onChanged();
  };

  const Row = ({ icon: Icon, label, children }: any) => (
    <div className="flex gap-3 items-start py-2 border-b border-border/30 last:border-0">
      <Icon className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
        <div className="text-xs mt-0.5">{children}</div>
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-3 border-b border-border/40">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <SheetTitle className="text-base truncate">{expense.expense_name}</SheetTitle>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${catColor}`}>{expense.category}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusColor}`}>{expense.status}</span>
                {expense.is_recurring && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border-blue-500/30 border">recurring</span>}
                {expense.is_billable && <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-400 border-teal-500/30 border">billable</span>}
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 pt-3">
            <Button size="sm" variant="outline" onClick={() => onEdit(expense)}><Pencil className="w-3 h-3 mr-1" />Edit</Button>
            <Button size="sm" variant="outline" onClick={() => onDuplicate(expense)}><Copy className="w-3 h-3 mr-1" />Duplicate</Button>
            {expense.status === "pending" && (
              <Button size="sm" variant="outline" onClick={markAsPaid}><Check className="w-3 h-3 mr-1" />Mark paid</Button>
            )}
            <Button size="sm" variant="ghost" onClick={handleDelete} className="text-rose-400 hover:text-rose-300 ml-auto">
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </SheetHeader>

        {/* Amount */}
        <div className="rounded-xl bg-muted/30 border border-border/40 p-4 mt-4 text-center">
          <p className="text-2xl font-semibold tabular-nums">{formatCurrency(Number(expense.amount_php) || 0, "PHP")}</p>
          {expense.currency !== "PHP" && (
            <p className="text-[11px] text-muted-foreground mt-1">Original: {Number(expense.amount).toFixed(2)} {expense.currency}</p>
          )}
        </div>

        {/* Details */}
        <div className="mt-4">
          {expense.description && <Row icon={FileText} label="Description">{expense.description}</Row>}
          {expense.vendor_name && <Row icon={User} label="Vendor">{expense.vendor_name}</Row>}
          {expense.invoice_number && <Row icon={FileSignature} label="Invoice #">{expense.invoice_number}</Row>}
          <Row icon={Calendar} label="Expense date">{new Date(expense.expense_date).toLocaleDateString()}</Row>
          {expense.payment_method && <Row icon={CreditCard} label="Payment">{expense.payment_method.replace("_", " ")}{expense.payment_reference && ` • ${expense.payment_reference}`}</Row>}
          {expense.is_recurring && <Row icon={Calendar} label="Next renewal">{expense.recurring_frequency} • {expense.next_recurring_date ?? "—"}</Row>}
          {expense.tags && expense.tags.length > 0 && (
            <Row icon={Tag} label="Tags">
              <div className="flex flex-wrap gap-1">
                {expense.tags.map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/40 border border-border/30">{t}</span>)}
              </div>
            </Row>
          )}
          {(linkedClient || linkedProject || linkedQuote) && (
            <>
              {linkedClient && <Row icon={User} label="Client">{linkedClient.business_name}</Row>}
              {linkedProject && <Row icon={Folder} label="Project">{linkedProject.name}</Row>}
              {linkedQuote && <Row icon={FileSignature} label="Quote">{linkedQuote.invoice_number ? `${linkedQuote.invoice_number} — ` : ""}{linkedQuote.title}</Row>}
            </>
          )}
          {expense.notes && <Row icon={FileText} label="Notes">{expense.notes}</Row>}
        </div>

        {/* Receipt */}
        <div className="mt-4">
          <h4 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Receipt</h4>
          {expense.receipt_url ? (
            <div className="rounded-lg border border-border/40 p-3">
              {isImage ? (
                <a href={expense.receipt_url} target="_blank" rel="noopener noreferrer">
                  <img src={expense.receipt_url} alt="receipt" className="rounded w-full max-h-64 object-contain bg-muted/20" />
                </a>
              ) : (
                <a href={expense.receipt_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-primary hover:underline">
                  <FileText className="w-4 h-4" /> View receipt PDF
                </a>
              )}
              <a
                href={expense.receipt_url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-primary hover:underline"
              >
                <Download className="w-3 h-3" /> Download
              </a>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">No receipt attached</p>
          )}
        </div>

        {/* Activity */}
        <div className="mt-4 pt-3 border-t border-border/30 text-[11px] text-muted-foreground space-y-1">
          <p>Created: {new Date(expense.created_at).toLocaleString()}</p>
          <p>Last edited: {new Date(expense.updated_at).toLocaleString()}</p>
          {expense.approved_at && (
            <p>Approved: {new Date(expense.approved_at).toLocaleString()}{expense.approved_by ? ` by ${expense.approved_by}` : ""}</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
