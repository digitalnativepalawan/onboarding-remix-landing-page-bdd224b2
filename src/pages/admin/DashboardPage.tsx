import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Globe, Hammer, Users, FileText, Wallet, Wrench,
  Plus, UserPlus, StickyNote, Upload, FileEdit, DollarSign,
  AlertCircle, Clock, Calendar, RefreshCw, Trash2, Check,
  TrendingDown, TrendingUp, Repeat,
} from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format, subMonths, startOfMonth, endOfMonth, isToday, parseISO, differenceInDays } from "date-fns";

const PHP_PER_USD = 58;

type LucideIconType = typeof Globe;

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIconType;
  onClick: () => void;
  loading?: boolean;
  accent?: string;
}

function StatCard({ title, value, icon: Icon, onClick, loading, accent = "text-primary" }: StatCardProps) {
  return (
    <Card
      onClick={onClick}
      className="p-4 cursor-pointer hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1 min-w-0">
          <p className="text-xs text-muted-foreground">{title}</p>
          {loading ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <p className="text-2xl font-bold tabular-nums">{value}</p>
          )}
        </div>
        <Icon className={`w-5 h-5 ${accent} shrink-0`} />
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [currency, setCurrency] = useState<"PHP" | "USD">("PHP");

  /* ── stats ─────────────────────────────────── */
  const stats = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [liveProj, devProj, activeClients, pendingQuotes, mrrSum, toolsInstalled] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("stage", "live"),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("stage", "development"),
        supabase.from("clients").select("id", { count: "exact", head: true }).eq("pipeline_stage", "active"),
        supabase.from("quotes").select("id", { count: "exact", head: true }).in("status", ["draft", "sent", "negotiated"]),
        supabase.from("clients").select("monthly_recurring_php"),
        supabase.from("tools").select("id", { count: "exact", head: true }).eq("installed", true),
      ]);
      const mrr = (mrrSum.data || []).reduce((s, c) => s + Number(c.monthly_recurring_php || 0), 0);
      return {
        live: liveProj.count || 0,
        dev: devProj.count || 0,
        clients: activeClients.count || 0,
        quotes: pendingQuotes.count || 0,
        mrr,
        tools: toolsInstalled.count || 0,
      };
    },
  });

  /* ── revenue chart (last 6 months) ─────────── */
  const revenue = useQuery({
    queryKey: ["dashboard-revenue"],
    queryFn: async () => {
      const since = startOfMonth(subMonths(new Date(), 5)).toISOString();
      const { data, error } = await supabase
        .from("revenue")
        .select("amount_php, payment_date, status")
        .gte("payment_date", since)
        .neq("status", "pending");
      if (error) throw error;
      const buckets: Record<string, number> = {};
      for (let i = 5; i >= 0; i--) {
        const d = subMonths(new Date(), i);
        buckets[format(d, "MMM")] = 0;
      }
      (data || []).forEach((r) => {
        if (!r.payment_date) return;
        const key = format(parseISO(r.payment_date), "MMM");
        if (key in buckets) buckets[key] += Number(r.amount_php || 0);
      });
      return Object.entries(buckets).map(([month, php]) => ({
        month, php, usd: Math.round(php / PHP_PER_USD),
      }));
    },
  });

  /* ── expenses summary + monthly buckets ────── */
  const expensesData = useQuery({
    queryKey: ["dashboard-expenses"],
    queryFn: async () => {
      const since = startOfMonth(subMonths(new Date(), 5)).toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from("expenses")
        .select("amount_php, expense_date")
        .gte("expense_date", since);
      if (error) throw error;

      const buckets: Record<string, number> = {};
      for (let i = 5; i >= 0; i--) buckets[format(subMonths(new Date(), i), "MMM")] = 0;
      let monthTotal = 0;
      let lastMonthTotal = 0;
      const now = new Date();
      const lastM = subMonths(now, 1);
      (data || []).forEach((e) => {
        if (!e.expense_date) return;
        const d = parseISO(e.expense_date);
        const key = format(d, "MMM");
        const amt = Number(e.amount_php || 0);
        if (key in buckets) buckets[key] += amt;
        if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) monthTotal += amt;
        if (d.getMonth() === lastM.getMonth() && d.getFullYear() === lastM.getFullYear()) lastMonthTotal += amt;
      });
      return { buckets, monthTotal, lastMonthTotal };
    },
  });

  /* ── upcoming recurring expense renewals (next 7 days) ── */
  const upcoming = useQuery({
    queryKey: ["dashboard-upcoming-renewals"],
    queryFn: async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const in7 = format(new Date(Date.now() + 7 * 86400000), "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("expenses")
        .select("id, expense_name, category, amount_php, currency, next_recurring_date")
        .eq("is_recurring", true)
        .not("next_recurring_date", "is", null)
        .gte("next_recurring_date", today)
        .lte("next_recurring_date", in7)
        .order("next_recurring_date", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  /* ── pipeline summary ──────────────────────── */
  const pipeline = useQuery({
    queryKey: ["dashboard-pipeline"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("pipeline_stage");
      if (error) throw error;
      const stages = ["prospect", "contacted", "demo", "negotiating", "closed", "active"];
      const counts: Record<string, number> = {};
      stages.forEach((s) => (counts[s] = 0));
      (data || []).forEach((c) => {
        if (c.pipeline_stage in counts) counts[c.pipeline_stage]++;
      });
      return stages.map((s) => ({ stage: s, count: counts[s] }));
    },
  });

  /* ── today's actions ───────────────────────── */
  const todays = useQuery({
    queryKey: ["dashboard-todays"],
    queryFn: async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const sevenDaysAgo = format(new Date(Date.now() - 7 * 86400000), "yyyy-MM-dd");

      const [followUps, draftOldQuotes, demos] = await Promise.all([
        supabase.from("clients").select("id, business_name, contact_name").eq("follow_up_date", today),
        supabase.from("quotes").select("id, title, created_at, client_id").eq("status", "draft").lte("created_at", sevenDaysAgo),
        supabase.from("notes").select("id, title, due_date").eq("type", "meeting").gte("due_date", today).order("due_date").limit(5),
      ]);
      return {
        followUps: followUps.data || [],
        draftQuotes: draftOldQuotes.data || [],
        demos: demos.data || [],
      };
    },
  });

  /* ── activity feed ─────────────────────────── */
  const activity = useQuery({
    queryKey: ["dashboard-activity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  /* ── weekly goals ──────────────────────────── */
  const goals = useQuery({
    queryKey: ["dashboard-goals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weekly_goals")
        .select("*")
        .order("sort_order", { ascending: true })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  const refreshAll = () => {
    qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    qc.invalidateQueries({ queryKey: ["dashboard-revenue"] });
    qc.invalidateQueries({ queryKey: ["dashboard-expenses"] });
    qc.invalidateQueries({ queryKey: ["dashboard-upcoming-renewals"] });
    qc.invalidateQueries({ queryKey: ["dashboard-pipeline"] });
    qc.invalidateQueries({ queryKey: ["dashboard-todays"] });
    qc.invalidateQueries({ queryKey: ["dashboard-activity"] });
    qc.invalidateQueries({ queryKey: ["dashboard-goals"] });
    toast.success("Refreshed");
  };

  /* auto-refresh every 60s */
  useEffect(() => {
    const id = setInterval(refreshAll, 60000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fmtPhp = (n: number) =>
    "₱" + new Intl.NumberFormat("en-PH", { maximumFractionDigits: 0 }).format(n);

  const stageLabels: Record<string, string> = {
    prospect: "Prospect", contacted: "Contacted", demo: "Demo",
    negotiating: "Negotiating", closed: "Closed", active: "Active",
  };
  const stageColors: Record<string, string> = {
    prospect: "bg-muted text-muted-foreground",
    contacted: "bg-blue-500/15 text-blue-400",
    demo: "bg-purple-500/15 text-purple-400",
    negotiating: "bg-amber-500/15 text-amber-400",
    closed: "bg-orange-500/15 text-orange-400",
    active: "bg-emerald-500/15 text-emerald-400",
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Overview</h2>
          <p className="text-xs text-muted-foreground">Live data — auto-refreshes every minute</p>
        </div>
        <Button size="sm" variant="outline" onClick={refreshAll}>
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
        <StatCard title="Live webapps" value={stats.data?.live ?? 0} icon={Globe}
          accent="text-emerald-400" loading={stats.isLoading}
          onClick={() => navigate("/admin/projects?stage=live")} />
        <StatCard title="In development" value={stats.data?.dev ?? 0} icon={Hammer}
          accent="text-blue-400" loading={stats.isLoading}
          onClick={() => navigate("/admin/projects?stage=development")} />
        <StatCard title="Active clients" value={stats.data?.clients ?? 0} icon={Users}
          accent="text-emerald-400" loading={stats.isLoading}
          onClick={() => navigate("/admin/clients?stage=active")} />
        <StatCard title="Pending quotes" value={stats.data?.quotes ?? 0} icon={FileText}
          accent="text-amber-400" loading={stats.isLoading}
          onClick={() => navigate("/admin/quotes")} />
        <StatCard title="MRR" value={fmtPhp(stats.data?.mrr ?? 0)} icon={Wallet}
          accent="text-primary" loading={stats.isLoading}
          onClick={() => navigate("/admin/revenue")} />
        <StatCard title="Tools installed" value={stats.data?.tools ?? 0} icon={Wrench}
          accent="text-purple-400" loading={stats.isLoading}
          onClick={() => navigate("/admin/tools")} />
        <ExpensesStatCard expensesData={expensesData.data} loading={expensesData.isLoading} fmtPhp={fmtPhp} navigate={navigate} />
        <NetProfitStatCard
          revenueData={revenue.data}
          expensesData={expensesData.data}
          loading={revenue.isLoading || expensesData.isLoading}
          fmtPhp={fmtPhp}
        />
      </div>

      {/* row: revenue + expenses donuts + upcoming renewals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h3 className="text-sm font-semibold">Revenue & Expenses — last 6 months</h3>
            <div className="flex gap-1">
              {(["PHP", "USD"] as const).map((c) => (
                <Button
                  key={c}
                  size="sm"
                  variant={currency === c ? "default" : "outline"}
                  onClick={() => setCurrency(c)}
                  className="h-7 px-2 text-xs"
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
          {revenue.isLoading || expensesData.isLoading ? (
            <Skeleton className="h-[280px] w-full" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DonutBlock
                title="Revenue by Month"
                data={buildDonut(revenue.data, currency, "revenue")}
                currency={currency}
                fmtPhp={fmtPhp}
              />
              <DonutBlock
                title="Expenses by Month"
                data={buildDonut(
                  Object.entries(expensesData.data?.buckets || {}).map(([month, php]) => ({
                    month, php: php as number, usd: Math.round((php as number) / PHP_PER_USD),
                  })),
                  currency,
                  "expenses"
                )}
                currency={currency}
                fmtPhp={fmtPhp}
              />
            </div>
          )}
        </Card>

        {/* upcoming renewals */}
        <UpcomingRenewals data={upcoming.data} loading={upcoming.isLoading} navigate={navigate} fmtPhp={fmtPhp} />
      </div>

      {/* pipeline row */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3">Client pipeline</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {(pipeline.data || []).map((p) => (
            <button
              key={p.stage}
              onClick={() => navigate(`/admin/clients?stage=${p.stage}`)}
              className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted/50 transition-colors border border-border/40"
            >
              <span className={`text-xs px-2 py-0.5 rounded ${stageColors[p.stage]}`}>
                {stageLabels[p.stage]}
              </span>
              <span className="text-sm font-mono tabular-nums ml-2">{p.count}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* row: today's actions + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TodaysActions data={todays.data} loading={todays.isLoading} navigate={navigate} />
        <ActivityFeed data={activity.data} loading={activity.isLoading} />
      </div>

      {/* quick actions */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Quick actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <QuickAction icon={Plus} label="New project" onClick={() => navigate("/admin/projects?new=1")} />
          <QuickAction icon={UserPlus} label="New client" onClick={() => navigate("/admin/clients?new=1")} />
          <QuickAction icon={StickyNote} label="New note" onClick={() => navigate("/admin/notes?new=1")} />
          <QuickAction icon={Upload} label="Upload media" onClick={() => navigate("/admin/media?new=1")} />
          <QuickAction icon={FileEdit} label="Create quote" onClick={() => navigate("/admin/quotes?new=1")} />
          <QuickAction icon={DollarSign} label="Record revenue" onClick={() => navigate("/admin/revenue?new=1")} />
        </div>
      </div>

      {/* weekly goals */}
      <WeeklyGoals goals={goals.data || []} loading={goals.isLoading}
        onChange={() => qc.invalidateQueries({ queryKey: ["dashboard-goals"] })} />
    </div>
  );
}

/* ── Expenses stat card (this month, vs last month) ───── */
function ExpensesStatCard({ expensesData, loading, fmtPhp, navigate }: any) {
  const cur = expensesData?.monthTotal ?? 0;
  const prev = expensesData?.lastMonthTotal ?? 0;
  const delta = prev > 0 ? ((cur - prev) / prev) * 100 : (cur > 0 ? 100 : 0);
  const up = delta > 0;
  return (
    <Card onClick={() => navigate("/admin/expenses")} className="p-4 cursor-pointer hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="space-y-1 min-w-0">
          <p className="text-xs text-muted-foreground">Monthly expenses</p>
          {loading ? <Skeleton className="h-7 w-16" /> : (
            <>
              <p className="text-2xl font-bold tabular-nums">{fmtPhp(cur)}</p>
              {prev > 0 && (
                <p className={`text-[10px] ${up ? "text-rose-400" : "text-emerald-400"} flex items-center gap-0.5`}>
                  {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(delta).toFixed(0)}% vs last
                </p>
              )}
            </>
          )}
        </div>
        <Wallet className="w-5 h-5 text-rose-400 shrink-0" />
      </div>
    </Card>
  );
}

/* ── Net profit stat card ─────────────────────── */
function NetProfitStatCard({ revenueData, expensesData, loading, fmtPhp }: any) {
  const now = new Date();
  const monthKey = format(now, "MMM");
  const revThisMonth = (revenueData || []).find((r: any) => r.month === monthKey)?.php ?? 0;
  const expThisMonth = expensesData?.monthTotal ?? 0;
  const profit = revThisMonth - expThisMonth;
  const margin = revThisMonth > 0 ? (profit / revThisMonth) * 100 : 0;
  const positive = profit >= 0;
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1 min-w-0">
          <p className="text-xs text-muted-foreground">Net profit</p>
          {loading ? <Skeleton className="h-7 w-16" /> : (
            <>
              <p className={`text-2xl font-bold tabular-nums ${positive ? "text-emerald-400" : "text-rose-400"}`}>
                {fmtPhp(profit)}
              </p>
              {revThisMonth > 0 && (
                <p className="text-[10px] text-muted-foreground">{margin.toFixed(0)}% margin</p>
              )}
            </>
          )}
        </div>
        {positive
          ? <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
          : <TrendingDown className="w-5 h-5 text-rose-400 shrink-0" />}
      </div>
    </Card>
  );
}

/* ── Merge revenue & expenses buckets for the combined chart ───── */
function mergeRevExp(
  revenue: { month: string; php: number; usd: number }[] | undefined,
  expenseBuckets: Record<string, number> | undefined,
  currency: "PHP" | "USD",
) {
  if (!revenue) return [];
  return revenue.map((r) => {
    const expPhp = expenseBuckets?.[r.month] ?? 0;
    const revVal = currency === "PHP" ? r.php : r.usd;
    const expVal = currency === "PHP" ? expPhp : Math.round(expPhp / PHP_PER_USD);
    return {
      month: r.month,
      revenue: revVal,
      expenses: expVal,
      profit: revVal - expVal,
    };
  });
}

/* ── Upcoming recurring renewals (next 7 days) ───────── */
function UpcomingRenewals({ data, loading, navigate, fmtPhp }: any) {
  const labelFor = (dateStr: string) => {
    const d = parseISO(dateStr);
    const days = differenceInDays(d, new Date());
    if (days <= 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `In ${days} days`;
  };
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Repeat className="w-4 h-4 text-blue-400" /> Upcoming renewals
        </h3>
        <button
          onClick={() => navigate("/admin/expenses")}
          className="text-[11px] text-primary hover:underline"
        >
          View all
        </button>
      </div>
      {loading ? (
        <Skeleton className="h-32 w-full" />
      ) : !data?.length ? (
        <p className="text-xs text-muted-foreground py-6 text-center">No renewals in the next 7 days</p>
      ) : (
        <div className="space-y-1">
          {data.map((e: any) => (
            <button
              key={e.id}
              onClick={() => navigate("/admin/expenses")}
              className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-muted/50 flex items-center gap-2"
            >
              <Repeat className="w-3 h-3 text-blue-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{e.expense_name}</p>
                <p className="text-[10px] text-muted-foreground">{labelFor(e.next_recurring_date)} · {e.category}</p>
              </div>
              <span className="text-[11px] font-mono tabular-nums shrink-0">{fmtPhp(Number(e.amount_php) || 0)}</span>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ── Quick action button ─────────────────────── */
function QuickAction({ icon: Icon, label, onClick }: { icon: LucideIconType; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1 p-3 rounded-md border border-border bg-card hover:border-primary/50 hover:bg-muted/30 transition-colors"
    >
      <Icon className="w-5 h-5 text-primary" />
      <span className="text-xs font-medium text-center">{label}</span>
    </button>
  );
}

/* ── Today's Actions widget ──────────────────── */
function TodaysActions({ data, loading, navigate }: any) {
  const total = (data?.followUps.length || 0) + (data?.draftQuotes.length || 0) + (data?.demos.length || 0);
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" /> Today's actions
        </h3>
        <Badge variant="secondary">{total}</Badge>
      </div>
      {loading ? (
        <Skeleton className="h-32 w-full" />
      ) : total === 0 ? (
        <p className="text-xs text-muted-foreground py-6 text-center">All clear — no urgent actions today 🎉</p>
      ) : (
        <div className="space-y-3">
          {data.followUps.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                Follow up today ({data.followUps.length})
              </p>
              <div className="space-y-1">
                {data.followUps.map((c: any) => (
                  <button key={c.id} onClick={() => navigate(`/admin/clients?id=${c.id}`)}
                    className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-muted/50 flex items-center gap-2">
                    <Users className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="font-medium truncate">{c.business_name}</span>
                    {c.contact_name && <span className="text-muted-foreground truncate">— {c.contact_name}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
          {data.draftQuotes.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                Draft quotes &gt;7 days old ({data.draftQuotes.length})
              </p>
              <div className="space-y-1">
                {data.draftQuotes.map((q: any) => (
                  <button key={q.id} onClick={() => navigate(`/admin/quotes?id=${q.id}`)}
                    className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-muted/50 flex items-center gap-2">
                    <FileText className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="font-medium truncate">{q.title}</span>
                    <span className="text-muted-foreground ml-auto shrink-0">
                      {differenceInDays(new Date(), parseISO(q.created_at))}d
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {data.demos.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                Scheduled demos ({data.demos.length})
              </p>
              <div className="space-y-1">
                {data.demos.map((m: any) => (
                  <button key={m.id} onClick={() => navigate(`/admin/notes?id=${m.id}`)}
                    className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-muted/50 flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-purple-400 shrink-0" />
                    <span className="font-medium truncate">{m.title}</span>
                    {m.due_date && (
                      <span className="text-muted-foreground ml-auto shrink-0">
                        {format(parseISO(m.due_date), "MMM d")}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

/* ── Activity Feed ───────────────────────────── */
function ActivityFeed({ data, loading }: any) {
  const iconFor = (type: string) => {
    switch (type) {
      case "projects": return Hammer;
      case "clients": return Users;
      case "quotes": return FileText;
      case "revenue": return DollarSign;
      case "notes": return StickyNote;
      default: return Clock;
    }
  };
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4 text-muted-foreground" /> Recent activity
      </h3>
      {loading ? (
        <Skeleton className="h-32 w-full" />
      ) : !data?.length ? (
        <p className="text-xs text-muted-foreground py-6 text-center">No activity yet</p>
      ) : (
        <div className="space-y-1">
          {data.map((a: any) => {
            const Icon = iconFor(a.entity_type);
            return (
              <div key={a.id} className="flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-muted/30">
                <Icon className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="truncate flex-1">{a.summary}</span>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {format(parseISO(a.created_at), "MMM d, HH:mm")}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

/* ── Weekly Goals ────────────────────────────── */
function WeeklyGoals({ goals, loading, onChange }: { goals: any[]; loading: boolean; onChange: () => void }) {
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState(1);

  const addGoal = async () => {
    if (!newTitle.trim()) return;
    const { error } = await supabase.from("weekly_goals").insert({
      title: newTitle.trim(), target_value: newTarget, sort_order: goals.length,
    });
    if (error) return toast.error(error.message);
    toast.success("Goal added");
    setNewTitle(""); setNewTarget(1); setAdding(false);
    onChange();
  };

  const updateGoal = async (id: string, patch: any) => {
    const { error } = await supabase.from("weekly_goals").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    onChange();
  };

  const deleteGoal = async (id: string) => {
    const { error } = await supabase.from("weekly_goals").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Goal removed");
    onChange();
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Weekly goals</h3>
        <Button size="sm" variant="outline" onClick={() => setAdding((x) => !x)} className="h-7">
          <Plus className="w-3 h-3 mr-1" /> Goal
        </Button>
      </div>

      {adding && (
        <div className="flex gap-2 mb-3 p-2 bg-muted/30 rounded-md">
          <Input
            placeholder="Goal title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="h-8 text-xs"
            autoFocus
          />
          <Input
            type="number"
            min={1}
            placeholder="Target"
            value={newTarget}
            onChange={(e) => setNewTarget(Math.max(1, parseInt(e.target.value) || 1))}
            className="h-8 text-xs w-20"
          />
          <Button size="sm" onClick={addGoal} className="h-8">Save</Button>
        </div>
      )}

      {loading ? (
        <Skeleton className="h-24 w-full" />
      ) : goals.length === 0 && !adding ? (
        <p className="text-xs text-muted-foreground py-6 text-center">
          No goals yet. Click "Goal" to add one.
        </p>
      ) : (
        <div className="space-y-3">
          {goals.map((g) => {
            const pct = Math.min(100, (g.current_value / Math.max(1, g.target_value)) * 100);
            return (
              <div key={g.id} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateGoal(g.id, { completed: !g.completed })}
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      g.completed ? "bg-emerald-500 border-emerald-500" : "border-muted-foreground"
                    }`}
                  >
                    {g.completed && <Check className="w-3 h-3 text-background" />}
                  </button>
                  <span className={`text-xs flex-1 truncate ${g.completed ? "line-through text-muted-foreground" : ""}`}>
                    {g.title}
                  </span>
                  <Input
                    type="number"
                    value={g.current_value}
                    onChange={(e) => updateGoal(g.id, { current_value: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="h-6 w-14 text-xs"
                  />
                  <span className="text-[10px] text-muted-foreground tabular-nums">/ {g.target_value}</span>
                  <button
                    onClick={() => deleteGoal(g.id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Delete goal"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <Progress value={pct} className="h-1.5" />
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
