import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Papa from "papaparse";
import {
  DndContext, DragEndEvent, PointerSensor, useSensor, useSensors,
} from "@dnd-kit/core";
import {
  Plus, LayoutGrid, List, Search, Download, Trash2, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { KanbanColumn } from "@/components/admin/clients/KanbanColumn";
import { ClientFormModal } from "@/components/admin/clients/ClientFormModal";
import { ClientDetailsModal } from "@/components/admin/clients/ClientDetailsModal";
import { Client, PIPELINE_STAGES, SERVICE_INTERESTS, fmtPhp } from "@/components/admin/clients/types";
import { format, parseISO } from "date-fns";

export default function ClientsPage() {
  const qc = useQueryClient();
  const [params, setParams] = useSearchParams();

  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string>(params.get("stage") || "all");
  const [interestFilter, setInterestFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [detailsClient, setDetailsClient] = useState<Client | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Client[];
    },
  });

  /* respond to query params (?new=1, ?id=X, ?stage=X) */
  useEffect(() => {
    if (params.get("new") === "1") {
      setEditing(null);
      setFormOpen(true);
      params.delete("new");
      setParams(params, { replace: true });
    }
    const id = params.get("id");
    if (id && clients) {
      const found = clients.find((c) => c.id === id);
      if (found) setDetailsClient(found);
      params.delete("id");
      setParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, clients]);

  const filtered = useMemo(() => {
    if (!clients) return [];
    return clients.filter((c) => {
      if (stageFilter !== "all" && c.pipeline_stage !== stageFilter) return false;
      if (interestFilter !== "all" && !(c.service_interests || []).includes(interestFilter)) return false;
      if (search) {
        const q = search.toLowerCase();
        const blob = `${c.business_name} ${c.contact_name || ""} ${c.location || ""}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [clients, stageFilter, interestFilter, search]);

  const byStage = useMemo(() => {
    const map: Record<string, Client[]> = {};
    PIPELINE_STAGES.forEach((s) => (map[s.id] = []));
    filtered.forEach((c) => {
      if (map[c.pipeline_stage]) map[c.pipeline_stage].push(c);
    });
    return map;
  }, [filtered]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const newStage = String(over.id);
    const client = clients?.find((c) => c.id === active.id);
    if (!client || client.pipeline_stage === newStage) return;

    /* optimistic */
    qc.setQueryData(["clients"], (old: Client[] | undefined) =>
      (old || []).map((c) => (c.id === client.id ? { ...c, pipeline_stage: newStage } : c)),
    );

    const { error } = await supabase
      .from("clients")
      .update({ pipeline_stage: newStage })
      .eq("id", client.id);

    if (error) {
      toast.error("Failed to move client");
      qc.invalidateQueries({ queryKey: ["clients"] });
    } else {
      toast.success(`Moved to ${PIPELINE_STAGES.find((s) => s.id === newStage)?.label}`);
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      qc.invalidateQueries({ queryKey: ["dashboard-pipeline"] });
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const bulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} clients?`)) return;
    const { error } = await supabase.from("clients").delete().in("id", Array.from(selected));
    if (error) return toast.error(error.message);
    toast.success(`${selected.size} clients deleted`);
    setSelected(new Set());
    qc.invalidateQueries({ queryKey: ["clients"] });
  };

  const exportCsv = (rows: Client[]) => {
    if (rows.length === 0) return toast.error("Nothing to export");
    const csv = Papa.unparse(rows.map((c) => ({
      business_name: c.business_name,
      contact_name: c.contact_name || "",
      whatsapp: c.whatsapp || "",
      email: c.email || "",
      location: c.location || "",
      pipeline_stage: c.pipeline_stage,
      estimated_value_php: c.estimated_value_php || 0,
      monthly_recurring_php: c.monthly_recurring_php || 0,
      follow_up_date: c.follow_up_date || "",
      service_interests: (c.service_interests || []).join("; "),
    })));
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clients-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  const onSaved = () => qc.invalidateQueries({ queryKey: ["clients"] });

  return (
    <div className="space-y-4">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clients…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9"
          />
        </div>

        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-36 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {PIPELINE_STAGES.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={interestFilter} onValueChange={setInterestFilter}>
          <SelectTrigger className="w-40 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All services</SelectItem>
            {SERVICE_INTERESTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>

        <div className="flex border border-border rounded-md overflow-hidden">
          <button
            onClick={() => setView("kanban")}
            className={`p-2 ${view === "kanban" ? "bg-primary text-primary-foreground" : "bg-card"}`}
            aria-label="Kanban view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 ${view === "list" ? "bg-primary text-primary-foreground" : "bg-card"}`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        <Button size="sm" variant="outline" onClick={() => exportCsv(filtered)}>
          <Download className="w-4 h-4 mr-1" /> CSV
        </Button>

        <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="w-4 h-4 mr-1" /> Client
        </Button>
      </div>

      {/* bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between gap-2 p-2 bg-primary/10 border border-primary/30 rounded-md">
          <span className="text-xs">{selected.size} selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => exportCsv((clients || []).filter((c) => selected.has(c.id)))}>
              <Download className="w-3 h-3 mr-1" /> Export
            </Button>
            <Button size="sm" variant="destructive" onClick={bulkDelete}>
              <Trash2 className="w-3 h-3 mr-1" /> Delete
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* loading */}
      {isLoading && <Skeleton className="h-96 w-full" />}

      {/* kanban */}
      {!isLoading && view === "kanban" && (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4">
            {PIPELINE_STAGES.map((stage) => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                clients={byStage[stage.id]}
                onCardClick={(c) => setDetailsClient(c)}
              />
            ))}
          </div>
        </DndContext>
      )}

      {/* list */}
      {!isLoading && view === "list" && (
        <Card className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">
                  <Checkbox
                    checked={selected.size > 0 && selected.size === filtered.length}
                    onCheckedChange={(v) =>
                      setSelected(v ? new Set(filtered.map((c) => c.id)) : new Set())
                    }
                  />
                </TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">MRR</TableHead>
                <TableHead>Follow up</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => {
                const stage = PIPELINE_STAGES.find((s) => s.id === c.pipeline_stage);
                return (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer"
                    onClick={() => setDetailsClient(c)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.has(c.id)}
                        onCheckedChange={() => toggleSelect(c.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{c.business_name}</TableCell>
                    <TableCell className="text-xs">{c.contact_name || "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.location || "—"}</TableCell>
                    <TableCell>
                      {stage && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${stage.color}`}>
                          {stage.label}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">{fmtPhp(c.estimated_value_php)}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{fmtPhp(c.monthly_recurring_php)}</TableCell>
                    <TableCell className="text-xs">
                      {c.follow_up_date ? format(parseISO(c.follow_up_date), "MMM d") : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-xs text-muted-foreground py-8">
                    No clients match your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* modals */}
      <ClientFormModal
        open={formOpen}
        client={editing}
        onClose={() => setFormOpen(false)}
        onSaved={onSaved}
      />
      <ClientDetailsModal
        open={!!detailsClient}
        client={detailsClient}
        onClose={() => setDetailsClient(null)}
        onEdit={() => {
          setEditing(detailsClient);
          setDetailsClient(null);
          setFormOpen(true);
        }}
        onChanged={onSaved}
      />
    </div>
  );
}
