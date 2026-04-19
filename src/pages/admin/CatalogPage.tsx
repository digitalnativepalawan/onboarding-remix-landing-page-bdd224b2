import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Package, Search, Layers, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { CATALOG_CATEGORIES, CatalogItem, formatPHP } from "@/components/admin/catalog/types";
import { CatalogCard } from "@/components/admin/catalog/CatalogCard";
import { CatalogFormModal } from "@/components/admin/catalog/CatalogFormModal";

type Row = CatalogItem & { id: string };

export default function CatalogPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showHidden, setShowHidden] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["catalog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("catalog_items")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const stats = useMemo(() => {
    const active = items.filter((i) => i.is_active);
    const avgPrice = active.length ? active.reduce((s, i) => s + Number(i.base_price_php || 0), 0) / active.length : 0;
    const categories = new Set(items.map((i) => i.category).filter(Boolean)).size;
    return { total: items.length, active: active.length, categories, avgPrice };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (!showHidden && !i.is_active) return false;
      if (categoryFilter !== "all" && i.category !== categoryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${i.name} ${i.description ?? ""} ${(i.tech_stack ?? []).join(" ")} ${(i.features ?? []).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, search, categoryFilter, showHidden]);

  const toggleActive = async (item: Row) => {
    const { error } = await supabase.from("catalog_items").update({ is_active: !item.is_active }).eq("id", item.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["catalog"] });
    toast.success(item.is_active ? "Hidden from quotes" : "Shown in quotes");
  };

  const addToQuote = (item: Row) => {
    sessionStorage.setItem(
      "quote-prefill-item",
      JSON.stringify({
        catalog_item_id: item.id,
        name: item.name,
        description: item.description ?? "",
        unit_price_php: Number(item.base_price_php) || 0,
      })
    );
    navigate("/admin/quotes?new=1");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Catalog</h1>
          <p className="text-sm text-muted-foreground">Reusable webapp templates for quoting</p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> New Item
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<Package className="h-4 w-4" />} label="Total Items" value={stats.total} />
        <StatCard icon={<Layers className="h-4 w-4" />} label="Active" value={stats.active} />
        <StatCard icon={<Layers className="h-4 w-4" />} label="Categories" value={stats.categories} />
        <StatCard icon={<DollarSign className="h-4 w-4" />} label="Avg Price" value={formatPHP(stats.avgPrice)} mono />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, features, tech..." className="pl-9" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATALOG_CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant={showHidden ? "default" : "outline"} size="sm" onClick={() => setShowHidden((v) => !v)}>
          {showHidden ? "Hiding none" : "Show hidden"}
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground text-center py-12">Loading catalog…</p>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium">No catalog items{items.length ? " match your filters" : " yet"}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length ? "Try clearing filters." : "Create your first reusable webapp template."}
          </p>
          {!items.length && (
            <Button className="mt-4" onClick={() => { setEditing(null); setFormOpen(true); }}>
              <Plus className="h-4 w-4 mr-1" /> New Item
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <CatalogCard
              key={item.id}
              item={item}
              onEdit={() => { setEditing(item); setFormOpen(true); }}
              onAddToQuote={() => addToQuote(item)}
              onToggleActive={() => toggleActive(item)}
            />
          ))}
        </div>
      )}

      <CatalogFormModal open={formOpen} onOpenChange={setFormOpen} initial={editing} />
    </div>
  );
}

function StatCard({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
        {icon} <span>{label}</span>
      </div>
      <p className={`text-xl font-semibold ${mono ? "font-mono" : ""}`}>{value}</p>
    </Card>
  );
}
