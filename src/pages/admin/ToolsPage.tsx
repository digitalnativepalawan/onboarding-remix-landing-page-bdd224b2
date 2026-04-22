import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Wrench, Search, ExternalLink, Pencil, Trash2, DollarSign, TrendingUp, Zap } from "lucide-react";
import { toast } from "sonner";
import { Tool, TOKEN_BURN_OPTIONS, formatPHP, formatUSD } from "@/components/admin/tools/types";
import { ToolFormModal } from "@/components/admin/tools/ToolFormModal";
import { ToolDetailModal } from "@/components/admin/tools/ToolDetailModal";

type Row = Tool & { id: string };

export default function ToolsPage() {
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewing, setViewing] = useState<Row | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "installed" | "wishlist">("all");

  const { data: tools = [], isLoading } = useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .order("priority_rank", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const stats = useMemo(() => {
    const installed = tools.filter((t) => t.installed);
    const monthlyCost = installed.reduce((s, t) => s + Number(t.monthly_cost_usd || 0), 0);
    const revenuePotential = tools.reduce((s, t) => s + Number(t.revenue_potential_php || 0), 0);
    return {
      total: tools.length,
      installed: installed.length,
      monthlyCost,
      revenuePotential,
    };
  }, [tools]);

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      if (filter === "installed" && !t.installed) return false;
      if (filter === "wishlist" && t.installed) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${t.name} ${t.description ?? ""} ${(t.use_cases ?? []).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [tools, search, filter]);

  const toggleInstalled = async (t: Row) => {
    const installed_at = !t.installed ? new Date().toISOString() : t.installed_at;
    const { error } = await supabase.from("tools").update({ installed: !t.installed, installed_at }).eq("id", t.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["tools"] });
  };

  const remove = async (t: Row) => {
    if (!confirm(`Delete "${t.name}"?`)) return;
    const { error } = await supabase.from("tools").delete().eq("id", t.id);
    if (error) return toast.error(error.message);
    toast.success("Tool deleted");
    qc.invalidateQueries({ queryKey: ["tools"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Tools</h1>
          <p className="text-sm text-muted-foreground">Dev tools, integrations & wishlist</p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> New Tool
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<Wrench className="h-4 w-4" />} label="Total" value={stats.total} />
        <StatCard icon={<Zap className="h-4 w-4" />} label="Installed" value={stats.installed} />
        <StatCard icon={<DollarSign className="h-4 w-4" />} label="Monthly Cost" value={formatUSD(stats.monthlyCost)} mono />
        <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Revenue Potential" value={formatPHP(stats.revenuePotential)} mono />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tools, use cases..." className="pl-9" />
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>All</Button>
          <Button size="sm" variant={filter === "installed" ? "default" : "outline"} onClick={() => setFilter("installed")}>Installed</Button>
          <Button size="sm" variant={filter === "wishlist" ? "default" : "outline"} onClick={() => setFilter("wishlist")}>Wishlist</Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground text-center py-12">Loading tools…</p>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Wrench className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium">No tools{tools.length ? " match your filters" : " yet"}</p>
          {!tools.length && (
            <Button className="mt-4" onClick={() => { setEditing(null); setFormOpen(true); }}>
              <Plus className="h-4 w-4 mr-1" /> Add your first tool
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => {
            const burn = TOKEN_BURN_OPTIONS.find((b) => b.value === t.token_burn);
            return (
              <Card
                key={t.id}
                className="p-4 flex flex-col gap-3 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all"
                onClick={() => { setViewing(t); setDetailOpen(true); }}
              >
                <div className="flex items-start justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold leading-tight truncate">{t.name}</h3>
                      {t.priority_rank != null && (
                        <Badge variant="outline" className="text-[10px] font-mono shrink-0">#{t.priority_rank}</Badge>
                      )}
                    </div>
                    {t.license && <p className="text-xs text-muted-foreground mt-0.5">{t.license}</p>}
                  </div>
                  <Switch checked={t.installed} onCheckedChange={() => toggleInstalled(t)} />
                </div>

                {t.description && <p className="text-xs text-muted-foreground line-clamp-2">{t.description}</p>}

                {t.use_cases && t.use_cases.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {t.use_cases.slice(0, 4).map((u, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px]">{u}</Badge>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t">
                  <div>
                    <p className="text-muted-foreground">Cost/mo</p>
                    <p className="font-mono">{formatUSD(Number(t.monthly_cost_usd || 0))}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Revenue</p>
                    <p className="font-mono">{formatPHP(Number(t.revenue_potential_php || 0))}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
                  {burn && <Badge className={burn.color} variant="outline">Burn: {burn.label}</Badge>}
                  <div className="flex gap-1 ml-auto">
                    {t.github_url && (
                      <Button asChild size="icon" variant="outline" className="h-7 w-7">
                        <a href={t.github_url} target="_blank" rel="noreferrer" title="Open"><ExternalLink className="h-3 w-3" /></a>
                      </Button>
                    )}
                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => { setEditing(t); setFormOpen(true); }}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => remove(t)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <ToolFormModal open={formOpen} onOpenChange={setFormOpen} initial={editing} />
      <ToolDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        tool={viewing}
        onEdit={(t) => { setDetailOpen(false); setEditing(t); setFormOpen(true); }}
      />
    </div>
  );
}

function StatCard({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">{icon}<span>{label}</span></div>
      <p className={`text-xl font-semibold ${mono ? "font-mono" : ""}`}>{value}</p>
    </Card>
  );
}
