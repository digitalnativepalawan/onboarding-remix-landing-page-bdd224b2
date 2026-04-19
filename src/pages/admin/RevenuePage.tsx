import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, TrendingUp, Wallet, Repeat, Clock, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { REVENUE_TYPES, REVENUE_STATUSES, formatPHP } from "@/components/admin/revenue/types";
import { RevenueFormModal } from "@/components/admin/revenue/RevenueFormModal";

export default function RevenuePage() {
  const qc = useQueryClient();
  const [params, setParams] = useSearchParams();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: revenue = [], isLoading } = useQuery({
    queryKey: ["revenue"],
    queryFn: async () => {
      const { data } = await supabase
        .from("revenue")
        .select("*, clients(business_name)")
        .order("payment_date", { ascending: false, nullsFirst: false });
      return data ?? [];
    },
  });

  useEffect(() => {
    if (params.get("new") === "1") {
      setEditing(null);
      setFormOpen(true);
      params.delete("new");
      setParams(params, { replace: true });
    }
  }, [params, setParams]);

  // Stats
  const stats = useMemo(() => {
    const paid = revenue.filter((r: any) => r.status === "paid");
    const pending = revenue.filter((r: any) => r.status === "pending");
    const overdue = revenue.filter((r: any) => r.status === "overdue");
    const totalPaid = paid.reduce((s: number, r: any) => s + Number(r.amount_php || 0), 0);
    const totalPending = pending.reduce((s: number, r: any) => s + Number(r.amount_php || 0), 0);
    const totalOverdue = overdue.reduce((s: number, r: any) => s + Number(r.amount_php || 0), 0);
    const mrr = paid.filter((r: any) => r.type === "monthly").reduce((s: number, r: any) => s + Number(r.amount_php || 0), 0);

    // This month paid
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = paid
      .filter((r: any) => r.payment_date && new Date(r.payment_date) >= monthStart)
      .reduce((s: number, r: any) => s + Number(r.amount_php || 0), 0);

    return { totalPaid, totalPending, totalOverdue, mrr, thisMonth };
  }, [revenue]);

  // Monthly chart data — last 6 months, split by setup vs monthly vs other
  const chartData = useMemo(() => {
    const months: Record<string, { month: string; setup: number; monthly: number; other: number }> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months[key] = { month: d.toLocaleDateString("en", { month: "short" }), setup: 0, monthly: 0, other: 0 };
    }
    revenue.forEach((r: any) => {
      if (r.status !== "paid" || !r.payment_date) return;
      const d = new Date(r.payment_date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!months[key]) return;
      const amount = Number(r.amount_php || 0);
      if (r.type === "setup") months[key].setup += amount;
      else if (r.type === "monthly") months[key].monthly += amount;
      else months[key].other += amount;
    });
    return Object.values(months);
  }, [revenue]);

  const filtered = useMemo(() => {
    return revenue.filter((r: any) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return r.notes?.toLowerCase().includes(s) || r.clients?.business_name?.toLowerCase().includes(s);
      }
      return true;
    });
  }, [revenue, search, typeFilter, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("revenue").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["revenue"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    const { error } = await supabase.from("revenue").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["revenue"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Revenue</h1>
          <p className="text-sm text-muted-foreground">Track payments, MRR, and cash flow</p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Record Revenue
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs"><Wallet className="h-3 w-3" /> Total Paid</div>
          <p className="text-xl font-bold mt-1 font-mono text-emerald-400">{formatPHP(stats.totalPaid)}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs"><Repeat className="h-3 w-3" /> MRR</div>
          <p className="text-xl font-bold mt-1 font-mono text-primary">{formatPHP(stats.mrr)}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs"><TrendingUp className="h-3 w-3" /> This Month</div>
          <p className="text-xl font-bold mt-1 font-mono">{formatPHP(stats.thisMonth)}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs"><Clock className="h-3 w-3" /> Pending</div>
          <p className="text-xl font-bold mt-1 font-mono text-orange-400">{formatPHP(stats.totalPending)}</p>
        </Card>
        <Card className="p-4 col-span-2 lg:col-span-1">
          <div className="text-muted-foreground text-xs">Overdue</div>
          <p className="text-xl font-bold mt-1 font-mono text-red-400">{formatPHP(stats.totalOverdue)}</p>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold mb-3">Last 6 Months — Paid Revenue Breakdown</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 6 }}
                formatter={(v: any) => formatPHP(Number(v))}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="setup" stackId="a" fill="hsl(var(--primary))" name="Setup" />
              <Bar dataKey="monthly" stackId="a" fill="hsl(142 70% 45%)" name="Monthly" />
              <Bar dataKey="other" stackId="a" fill="hsl(280 65% 60%)" name="Other" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input placeholder="Search notes or client..." value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-xs" />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {REVENUE_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {REVENUE_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No revenue recorded yet</TableCell></TableRow>
            ) : filtered.map((r: any) => {
              const type = REVENUE_TYPES.find((t) => t.value === r.type);
              const status = REVENUE_STATUSES.find((s) => s.value === r.status);
              return (
                <TableRow key={r.id}>
                  <TableCell className="text-xs whitespace-nowrap">{r.payment_date || <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-muted-foreground">{r.clients?.business_name || "—"}</TableCell>
                  <TableCell><Badge variant="outline" className={type?.color}>{type?.label}</Badge></TableCell>
                  <TableCell>
                    <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                      <SelectTrigger className="h-7 w-28 border-0 p-0">
                        <Badge className={status?.color + " cursor-pointer"}>{status?.label}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {REVENUE_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold">{formatPHP(Number(r.amount_php))}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{r.notes || "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditing(r); setFormOpen(true); }}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => remove(r.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <RevenueFormModal open={formOpen} onOpenChange={setFormOpen} initial={editing} />
    </div>
  );
}
