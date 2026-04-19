import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus, Pencil, Wallet, TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { CATEGORY_COLORS, CATEGORY_OPTIONS, type ExpenseRow } from "./types";
import BudgetFormModal, { type BudgetRow } from "./BudgetFormModal";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface Props {
  rows: ExpenseRow[];
}

export default function BudgetsTab({ rows }: Props) {
  const now = new Date();
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [year, setYear] = useState<number>(now.getFullYear());
  const [budgets, setBudgets] = useState<BudgetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BudgetRow | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("expense_budgets")
      .select("*")
      .eq("month", month)
      .eq("year", year);
    if (error) toast.error("Failed to load budgets");
    setBudgets((data as BudgetRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [month, year]);

  // Calculate spending per category for the selected month/year
  const spentByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    rows.forEach((r) => {
      const d = new Date(r.expense_date);
      if (d.getMonth() + 1 === month && d.getFullYear() === year) {
        map[r.category] = (map[r.category] ?? 0) + (Number(r.amount_php) || 0);
      }
    });
    return map;
  }, [rows, month, year]);

  const totalBudget = budgets.reduce((s, b) => s + Number(b.budget_php || 0), 0);
  const totalSpent = Object.values(spentByCategory).reduce((s, v) => s + v, 0);
  const remaining = totalBudget - totalSpent;
  const overallPct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const overallTone = overallPct > 100 ? "rose" : overallPct >= 80 ? "amber" : "emerald";

  const onAdd = (category?: string) => {
    setEditing(category ? { category, month, year, budget_php: 0 } : null);
    setModalOpen(true);
  };
  const onEdit = (b: BudgetRow) => { setEditing(b); setModalOpen(true); };

  const years = Array.from({ length: 7 }, (_, i) => now.getFullYear() - 3 + i);

  return (
    <div className="space-y-4">
      {/* Period selector + summary */}
      <div className="rounded-xl border border-border/40 bg-card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold">Budget for</h3>
          </div>
          <div className="flex gap-2">
            <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
              <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
              <SelectTrigger className="h-8 w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                {years.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" className="sm:ml-auto" onClick={() => onAdd()}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />Add budget
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <SummaryCard label="Total budget" value={formatCurrency(totalBudget, "PHP")} icon={Wallet} />
          <SummaryCard label="Total spent" value={formatCurrency(totalSpent, "PHP")} icon={TrendingDown} tone="rose" />
          <SummaryCard
            label="Remaining"
            value={formatCurrency(Math.max(0, remaining), "PHP")}
            icon={remaining < 0 ? AlertTriangle : CheckCircle2}
            tone={remaining < 0 ? "rose" : "emerald"}
          />
          <SummaryCard
            label="Status"
            value={overallPct > 100 ? "Over budget" : overallPct >= 80 ? "Near limit" : "Under budget"}
            icon={overallPct > 100 ? AlertTriangle : CheckCircle2}
            tone={overallTone}
          />
        </div>

        {totalBudget > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Overall usage</span>
              <span className="tabular-nums">{overallPct.toFixed(0)}%</span>
            </div>
            <Progress value={Math.min(100, overallPct)} className={`h-2 ${barColor(overallPct)}`} />
          </div>
        )}
      </div>

      {/* Category grid */}
      {loading ? (
        <div className="text-xs text-muted-foreground p-4">Loading budgets…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORY_OPTIONS.map((cat) => {
            const budget = budgets.find((b) => b.category === cat.value);
            const spent = spentByCategory[cat.value] ?? 0;
            const budgetAmt = Number(budget?.budget_php ?? 0);
            const pct = budgetAmt > 0 ? (spent / budgetAmt) * 100 : 0;
            const catColor = CATEGORY_COLORS[cat.value] ?? CATEGORY_COLORS.miscellaneous;
            return (
              <div key={cat.value} className="rounded-xl border border-border/40 bg-card p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${catColor}`}>{cat.label}</span>
                    <p className="text-sm font-semibold mt-2">
                      {budget ? formatCurrency(budgetAmt, "PHP") : <span className="text-muted-foreground font-normal">No budget</span>}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Spent {formatCurrency(spent, "PHP")}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => budget ? onEdit(budget) : onAdd(cat.value)}
                  >
                    {budget ? <Pencil className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  </Button>
                </div>

                {budget ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className={textColor(pct)}>{pct.toFixed(0)}% used</span>
                      <span className="tabular-nums text-muted-foreground">
                        {formatCurrency(Math.max(0, budgetAmt - spent), "PHP")} left
                      </span>
                    </div>
                    <Progress value={Math.min(100, pct)} className={`h-1.5 ${barColor(pct)}`} />
                  </div>
                ) : spent > 0 ? (
                  <p className="text-[11px] text-amber-400">Spending without a budget</p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">No activity</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <BudgetFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        budget={editing}
        defaultMonth={month}
        defaultYear={year}
        onSaved={load}
      />
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, tone = "primary" }: any) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    rose: "bg-rose-500/15 text-rose-400",
    emerald: "bg-emerald-500/15 text-emerald-400",
    amber: "bg-amber-500/15 text-amber-400",
  };
  return (
    <div className="rounded-lg border border-border/40 bg-background/40 p-3 flex items-center gap-3">
      <div className={`rounded-lg p-2 ${tones[tone] ?? tones.primary}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}

function barColor(pct: number) {
  if (pct > 100) return "[&>div]:bg-rose-500";
  if (pct >= 80) return "[&>div]:bg-amber-500";
  return "[&>div]:bg-emerald-500";
}
function textColor(pct: number) {
  if (pct > 100) return "text-rose-400";
  if (pct >= 80) return "text-amber-400";
  return "text-emerald-400";
}
