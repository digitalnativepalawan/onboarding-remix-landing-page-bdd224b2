import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Receipt, Search, Pencil, Trash2, FileText, RefreshCw, Filter, TrendingDown, Repeat, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import ExpenseFormModal from "@/components/admin/expenses/ExpenseFormModal";
import ExpenseDetailSheet from "@/components/admin/expenses/ExpenseDetailSheet";
import { CATEGORY_COLORS, CATEGORY_OPTIONS, type ExpenseRow } from "@/components/admin/expenses/types";

const StatCard = ({ icon: Icon, label, value, tone = "primary" }: any) => (
  <div className="rounded-xl border border-border/40 bg-card p-3 flex items-center gap-3">
    <div className={`rounded-lg p-2 shrink-0 ${tone === "danger" ? "bg-rose-500/15 text-rose-400" : "bg-primary/10 text-primary"}`}>
      <Icon className="w-4 h-4" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold truncate">{value}</p>
    </div>
  </div>
);

export default function ExpensesPage() {
  const [rows, setRows] = useState<ExpenseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ExpenseRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState<ExpenseRow | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("expenses").select("*").order("expense_date", { ascending: false });
    if (error) toast.error("Failed to load expenses");
    setRows((data as ExpenseRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          r.expense_name.toLowerCase().includes(q) ||
          (r.vendor_name ?? "").toLowerCase().includes(q) ||
          (r.notes ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [rows, search, categoryFilter]);

  const stats = useMemo(() => {
    const totalPHP = rows.reduce((s, r) => s + (Number(r.amount_php) || 0), 0);
    const now = new Date();
    const monthPHP = rows
      .filter((r) => {
        const d = new Date(r.expense_date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, r) => s + (Number(r.amount_php) || 0), 0);
    const recurring = rows.filter((r) => r.is_recurring).length;
    const billable = rows.filter((r) => r.is_billable).length;
    return { totalPHP, monthPHP, recurring, billable };
  }, [rows]);

  const onEdit = (e: ExpenseRow) => { setEditing(e); setDetailOpen(false); setModalOpen(true); };
  const onAdd = () => { setEditing(null); setModalOpen(true); };
  const onView = (e: ExpenseRow) => { setDetail(e); setDetailOpen(true); };
  const onDuplicate = (e: ExpenseRow) => {
    const dup: ExpenseRow = {
      ...e,
      id: "",
      expense_name: `${e.expense_name} (copy)`,
      receipt_path: null,
      receipt_url: null,
    } as ExpenseRow;
    setEditing(null);
    // open modal pre-filled with duplicate data by passing via editing trick:
    // simplest: open a fresh add modal, user re-enters key fields. Instead pre-populate via editing without id.
    setEditing({ ...dup, id: undefined as any });
    setDetailOpen(false);
    setModalOpen(true);
  };
  const onDelete = async (id: string, path: string | null) => {
    if (!confirm("Delete this expense?")) return;
    if (path) await supabase.storage.from("receipts").remove([path]);
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) return toast.error("Delete failed");
    toast.success("Expense deleted");
    load();
  };

  return (
    <div className="space-y-4 max-w-6xl">
      {/* Header */}
      <div className="rounded-xl border border-border/40 bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 shrink-0"><Receipt className="w-5 h-5 text-primary" /></div>
          <div className="min-w-0">
            <h1 className="text-base font-semibold">Expenses</h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">Track operating costs, subscriptions, and billable spend.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={load}><RefreshCw className="w-3.5 h-3.5 mr-1.5" />Refresh</Button>
          <Button size="sm" onClick={onAdd}><Plus className="w-3.5 h-3.5 mr-1.5" />Add Expense</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={TrendingDown} label="Total spent" value={formatCurrency(stats.totalPHP, "PHP")} tone="danger" />
        <StatCard icon={Receipt} label="This month" value={formatCurrency(stats.monthPHP, "PHP")} />
        <StatCard icon={Repeat} label="Recurring" value={stats.recurring} />
        <StatCard icon={CheckCircle2} label="Billable" value={stats.billable} />
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border/40 bg-card p-3 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Search expenses, vendors, notes…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="sm:w-48"><Filter className="w-3.5 h-3.5 mr-1.5" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORY_OPTIONS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-xs text-muted-foreground p-4">Loading expenses…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/40 p-8 text-center">
          <Receipt className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm text-muted-foreground mb-3">{rows.length === 0 ? "No expenses yet" : "No matches for current filters"}</p>
          {rows.length === 0 && <Button size="sm" onClick={onAdd}><Plus className="w-3.5 h-3.5 mr-1.5" />Add your first expense</Button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((r) => {
            const catColor = CATEGORY_COLORS[r.category] ?? CATEGORY_COLORS.miscellaneous;
            return (
              <div key={r.id} className="rounded-xl border border-border/40 bg-card p-4 flex flex-col gap-2 hover:border-border/70 transition">
                <div className="flex items-start justify-between gap-2">
                  <button onClick={() => onView(r)} className="min-w-0 flex-1 text-left group">
                    <p className="text-sm font-semibold truncate group-hover:text-primary transition">{r.expense_name}</p>
                    {r.vendor_name && <p className="text-[11px] text-muted-foreground truncate">{r.vendor_name}</p>}
                  </button>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold tabular-nums">{formatCurrency(Number(r.amount_php) || 0, "PHP")}</p>
                    {r.currency !== "PHP" && (
                      <p className="text-[10px] text-muted-foreground">{r.amount} {r.currency}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${catColor}`}>{r.category}</span>
                  {r.is_recurring && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 inline-flex items-center gap-1">
                      <Repeat className="w-2.5 h-2.5" /> {r.recurring_frequency ?? "recurring"}
                    </span>
                  )}
                  {r.is_billable && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">billable</span>
                  )}
                  <span className="text-[10px] text-muted-foreground ml-auto">{new Date(r.expense_date).toLocaleDateString()}</span>
                </div>

                {r.notes && <p className="text-[11px] text-muted-foreground line-clamp-2">{r.notes}</p>}

                <div className="flex items-center gap-2 pt-1 border-t border-border/30 mt-1">
                  {r.receipt_url && (
                    <a href={r.receipt_url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary hover:underline inline-flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Receipt
                    </a>
                  )}
                  <div className="ml-auto flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => onEdit(r)}><Pencil className="w-3 h-3" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => onDelete(r.id, r.receipt_path)}><Trash2 className="w-3 h-3 text-rose-400" /></Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ExpenseFormModal open={modalOpen} onOpenChange={setModalOpen} expense={editing} onSaved={() => load()} />
      <ExpenseDetailSheet open={detailOpen} onOpenChange={setDetailOpen} expense={detail} onChanged={load} onEdit={onEdit} onDuplicate={onDuplicate} />
    </div>
  );
}
