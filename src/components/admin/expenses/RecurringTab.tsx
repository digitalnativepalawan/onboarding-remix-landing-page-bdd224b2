import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar, Repeat, CreditCard, Plus, SkipForward, Pause, Pencil, Trash2, Zap, Database, Cloud, Brain, Github } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { CATEGORY_COLORS, type ExpenseRow } from "./types";

interface Props {
  rows: ExpenseRow[];
  onAddPrefilled: (seed: Partial<ExpenseRow>) => void;
  onEdit: (e: ExpenseRow) => void;
  onView: (e: ExpenseRow) => void;
  onDelete: (id: string, path: string | null) => void;
  onChanged: () => void;
}

const PRESET_SUBSCRIPTIONS = [
  { name: "Lovable.dev", icon: Zap, price: 1450, frequency: "monthly", category: "subscriptions", vendor: "Lovable" },
  { name: "Supabase", icon: Database, price: 1450, frequency: "monthly", category: "subscriptions", vendor: "Supabase Inc." },
  { name: "Vercel Pro", icon: Cloud, price: 1160, frequency: "monthly", category: "subscriptions", vendor: "Vercel" },
  { name: "Claude API", icon: Brain, price: 1160, frequency: "monthly", category: "development", vendor: "Anthropic" },
  { name: "GitHub Pro", icon: Github, price: 230, frequency: "monthly", category: "development", vendor: "GitHub" },
];

const monthsBetween = (freq: string) => ({ weekly: 0.25, monthly: 1, quarterly: 3, yearly: 12 }[freq] ?? 1);
const daysUntil = (iso: string | null) => {
  if (!iso) return Infinity;
  const diff = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
  return diff;
};
const formatDaysLeft = (n: number) => {
  if (!isFinite(n)) return "—";
  if (n < 0) return `${Math.abs(n)}d overdue`;
  if (n === 0) return "Today";
  if (n === 1) return "Tomorrow";
  return `In ${n}d`;
};

export default function RecurringTab({ rows, onAddPrefilled, onEdit, onView, onDelete, onChanged }: Props) {
  const recurring = useMemo(() => rows.filter((r) => r.is_recurring), [rows]);

  const stats = useMemo(() => {
    let monthlyTotal = 0;
    let yearlyTotal = 0;
    for (const r of recurring) {
      const amt = Number(r.amount_php) || 0;
      const months = monthsBetween(r.recurring_frequency ?? "monthly");
      monthlyTotal += amt / months;
      yearlyTotal += (amt / months) * 12;
    }
    const upcoming = recurring
      .filter((r) => r.next_recurring_date)
      .map((r) => ({ r, days: daysUntil(r.next_recurring_date) }))
      .sort((a, b) => a.days - b.days)[0];
    return {
      monthlyTotal,
      yearlyTotal,
      activeCount: recurring.length,
      nextRenewal: upcoming ? `${upcoming.r.expense_name} • ${formatDaysLeft(upcoming.days)}` : "—",
    };
  }, [recurring]);

  const sorted = useMemo(
    () => [...recurring].sort((a, b) => daysUntil(a.next_recurring_date) - daysUntil(b.next_recurring_date)),
    [recurring]
  );

  const Stat = ({ icon: Icon, label, value, tone = "primary" }: any) => (
    <div className="rounded-xl border border-border/40 bg-card p-3 flex items-center gap-3">
      <div className={`rounded-lg p-2 shrink-0 ${tone === "danger" ? "bg-rose-500/15 text-rose-400" : tone === "info" ? "bg-blue-500/15 text-blue-400" : "bg-primary/10 text-primary"}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold truncate">{value}</p>
      </div>
    </div>
  );

  const skipNext = async (r: ExpenseRow) => {
    if (!r.next_recurring_date) return;
    const months = monthsBetween(r.recurring_frequency ?? "monthly");
    const next = new Date(r.next_recurring_date);
    next.setMonth(next.getMonth() + Math.round(months));
    const { error } = await supabase.from("expenses").update({ next_recurring_date: next.toISOString().slice(0, 10) }).eq("id", r.id);
    if (error) return toast.error("Skip failed");
    toast.success("Skipped to next cycle");
    onChanged();
  };

  const togglePause = async (r: ExpenseRow) => {
    const { error } = await supabase.from("expenses").update({ status: r.status === "approved" ? "pending" : "approved" }).eq("id", r.id);
    if (error) return toast.error("Update failed");
    toast.success(r.status === "approved" ? "Paused" : "Resumed");
    onChanged();
  };

  const addPreset = (p: typeof PRESET_SUBSCRIPTIONS[number]) => {
    const next = new Date();
    next.setMonth(next.getMonth() + 1);
    onAddPrefilled({
      expense_name: p.name,
      vendor_name: p.vendor,
      amount: p.price,
      currency: "PHP",
      category: p.category,
      is_recurring: true,
      recurring_frequency: p.frequency,
      next_recurring_date: next.toISOString().slice(0, 10),
      payment_method: "credit_card",
      expense_type: "recurring",
      status: "approved",
    } as Partial<ExpenseRow>);
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon={Repeat} label="Monthly recurring" value={formatCurrency(stats.monthlyTotal, "PHP")} />
        <Stat icon={Calendar} label="Yearly recurring" value={formatCurrency(stats.yearlyTotal, "PHP")} tone="info" />
        <Stat icon={CreditCard} label="Active subs" value={stats.activeCount} />
        <Stat icon={Calendar} label="Next renewal" value={stats.nextRenewal} tone="danger" />
      </div>

      {/* Quick add */}
      <div className="rounded-xl border border-border/40 bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold">Quick add subscription</h3>
            <p className="text-[11px] text-muted-foreground">Pre-filled common tools — click to add</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => onAddPrefilled({ is_recurring: true, recurring_frequency: "monthly", expense_type: "recurring", category: "subscriptions" } as Partial<ExpenseRow>)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Custom
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {PRESET_SUBSCRIPTIONS.map((p) => (
            <button
              key={p.name}
              onClick={() => addPreset(p)}
              className="rounded-lg border border-border/40 bg-card hover:border-primary/50 hover:bg-primary/5 transition p-3 text-left flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-md bg-primary/10 text-primary p-1.5"><p.icon className="w-3.5 h-3.5" /></div>
                <Plus className="w-3 h-3 text-muted-foreground" />
              </div>
              <p className="text-xs font-semibold truncate">{p.name}</p>
              <p className="text-[10px] text-muted-foreground">From {formatCurrency(p.price, "PHP")} / {p.frequency}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/40 p-8 text-center">
          <Repeat className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm text-muted-foreground">No recurring expenses yet — add one from the quick list above.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/30 text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2 font-medium">Name</th>
                  <th className="text-left px-3 py-2 font-medium hidden md:table-cell">Category</th>
                  <th className="text-right px-3 py-2 font-medium">Amount</th>
                  <th className="text-left px-3 py-2 font-medium hidden sm:table-cell">Frequency</th>
                  <th className="text-left px-3 py-2 font-medium">Next due</th>
                  <th className="text-center px-3 py-2 font-medium hidden lg:table-cell">Active</th>
                  <th className="text-right px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r) => {
                  const catColor = CATEGORY_COLORS[r.category] ?? CATEGORY_COLORS.miscellaneous;
                  const days = daysUntil(r.next_recurring_date);
                  const dueColor = days < 0 ? "text-rose-400" : days <= 3 ? "text-amber-400" : "text-muted-foreground";
                  return (
                    <tr key={r.id} className="border-t border-border/30 hover:bg-muted/20">
                      <td className="px-3 py-2">
                        <button onClick={() => onView(r)} className="font-medium hover:text-primary transition text-left">{r.expense_name}</button>
                        {r.vendor_name && <p className="text-[10px] text-muted-foreground truncate max-w-[160px]">{r.vendor_name}</p>}
                      </td>
                      <td className="px-3 py-2 hidden md:table-cell">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${catColor}`}>{r.category}</span>
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums font-medium">{formatCurrency(Number(r.amount_php) || 0, "PHP")}</td>
                      <td className="px-3 py-2 hidden sm:table-cell capitalize">{r.recurring_frequency}</td>
                      <td className={`px-3 py-2 ${dueColor}`}>
                        {r.next_recurring_date ? (
                          <>
                            <div>{new Date(r.next_recurring_date).toLocaleDateString()}</div>
                            <div className="text-[10px]">{formatDaysLeft(days)}</div>
                          </>
                        ) : "—"}
                      </td>
                      <td className="px-3 py-2 text-center hidden lg:table-cell">
                        <Switch checked={r.status === "approved"} onCheckedChange={() => togglePause(r)} />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex justify-end gap-0.5">
                          <Button size="sm" variant="ghost" title="Skip next" onClick={() => skipNext(r)}><SkipForward className="w-3 h-3" /></Button>
                          <Button size="sm" variant="ghost" title="Pause/Resume" onClick={() => togglePause(r)}><Pause className="w-3 h-3" /></Button>
                          <Button size="sm" variant="ghost" title="Edit" onClick={() => onEdit(r)}><Pencil className="w-3 h-3" /></Button>
                          <Button size="sm" variant="ghost" title="Delete" onClick={() => onDelete(r.id, r.receipt_path)}><Trash2 className="w-3 h-3 text-rose-400" /></Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
