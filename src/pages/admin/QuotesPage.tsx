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
import { Plus, FileText, Clock, CheckCircle2, TrendingUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { QUOTE_STATUSES, QuoteDraft, formatPHP } from "@/components/admin/quotes/types";
import { QuoteWizardModal } from "@/components/admin/quotes/QuoteWizardModal";
import { QuoteDetailModal } from "@/components/admin/quotes/QuoteDetailModal";

export default function QuotesPage() {
  const qc = useQueryClient();
  const [params, setParams] = useSearchParams();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editDraft, setEditDraft] = useState<QuoteDraft | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const { data } = await supabase.from("quotes").select("*, clients(business_name)").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  useEffect(() => {
    if (params.get("new") === "1") {
      setEditDraft(null);
      setWizardOpen(true);
      params.delete("new");
      setParams(params, { replace: true });
    }
    const id = params.get("id");
    if (id) {
      setDetailId(id);
      params.delete("id");
      setParams(params, { replace: true });
    }
  }, [params, setParams]);

  const stats = useMemo(() => {
    const total = quotes.length;
    const draft = quotes.filter((q: any) => q.status === "draft").length;
    const sent = quotes.filter((q: any) => ["sent", "viewed"].includes(q.status)).length;
    const accepted = quotes.filter((q: any) => q.status === "accepted").length;
    const value = quotes.filter((q: any) => ["sent", "viewed", "accepted"].includes(q.status))
      .reduce((s: number, q: any) => s + Number(q.total_php || 0), 0);
    return { total, draft, sent, accepted, value };
  }, [quotes]);

  const filtered = useMemo(() => {
    return quotes.filter((q: any) => {
      if (statusFilter !== "all" && q.status !== statusFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return q.title?.toLowerCase().includes(s) || q.clients?.business_name?.toLowerCase().includes(s);
      }
      return true;
    });
  }, [quotes, search, statusFilter]);

  const openEdit = async (id: string) => {
    const { data: q } = await supabase.from("quotes").select("*").eq("id", id).single();
    const { data: items } = await supabase.from("quote_items").select("*").eq("quote_id", id).order("sort_order");
    if (!q) return;
    setEditDraft({
      id: q.id, client_id: q.client_id, title: q.title, status: q.status as any, notes: q.notes,
      terms: q.terms, total_php: Number(q.total_php), valid_until: q.valid_until, sent_via: q.sent_via,
      follow_up_count: q.follow_up_count,
      items: (items ?? []).map((it: any) => ({
        catalog_item_id: it.catalog_item_id, name: it.name, description: it.description,
        qty: Number(it.qty), unit_price_php: Number(it.unit_price_php), line_total_php: Number(it.line_total_php),
        sort_order: it.sort_order,
      })),
    });
    setDetailId(null);
    setWizardOpen(true);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("quotes").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    qc.invalidateQueries({ queryKey: ["quotes"] });
  };

  const deleteQuote = async (id: string) => {
    if (!confirm("Delete this quote?")) return;
    await supabase.from("quote_items").delete().eq("quote_id", id);
    const { error } = await supabase.from("quotes").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["quotes"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quotes</h1>
          <p className="text-sm text-muted-foreground">Closing tool — pipeline value & follow-ups</p>
        </div>
        <Button onClick={() => { setEditDraft(null); setWizardOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> New Quote
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs"><FileText className="h-3 w-3" /> Total</div>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs"><Clock className="h-3 w-3" /> Drafts</div>
          <p className="text-2xl font-bold mt-1">{stats.draft}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs"><TrendingUp className="h-3 w-3" /> Sent</div>
          <p className="text-2xl font-bold mt-1">{stats.sent}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs"><CheckCircle2 className="h-3 w-3" /> Accepted</div>
          <p className="text-2xl font-bold mt-1 text-emerald-400">{stats.accepted}</p>
        </Card>
        <Card className="p-4 col-span-2 lg:col-span-1">
          <div className="text-muted-foreground text-xs">Pipeline Value</div>
          <p className="text-xl font-bold mt-1 font-mono text-primary">{formatPHP(stats.value)}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input placeholder="Search title or client..." value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-xs" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {QUOTE_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Valid</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No quotes yet — create one to start closing</TableCell></TableRow>
            ) : filtered.map((q: any) => {
              const status = QUOTE_STATUSES.find((s) => s.value === q.status);
              return (
                <TableRow key={q.id} className="cursor-pointer" onClick={() => setDetailId(q.id)}>
                  <TableCell className="font-medium">{q.title}</TableCell>
                  <TableCell className="text-muted-foreground">{q.clients?.business_name || "—"}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select value={q.status} onValueChange={(v) => updateStatus(q.id, v)}>
                      <SelectTrigger className="h-7 w-28 border-0 p-0">
                        <Badge className={status?.color + " cursor-pointer"}>{status?.label}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {QUOTE_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right font-mono">{formatPHP(Number(q.total_php))}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{q.valid_until || "—"}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => deleteQuote(q.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <QuoteWizardModal open={wizardOpen} onOpenChange={setWizardOpen} initial={editDraft} />
      <QuoteDetailModal quoteId={detailId} onOpenChange={(o) => !o && setDetailId(null)} onEdit={() => detailId && openEdit(detailId)} />
    </div>
  );
}
