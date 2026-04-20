import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, LayoutGrid, List } from "lucide-react";
import { toast } from "sonner";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PROJECT_STAGES, formatPHP } from "@/components/admin/projects/types";
import { KanbanColumn } from "@/components/admin/projects/KanbanColumn";
import { ProjectFormModal } from "@/components/admin/projects/ProjectFormModal";

export default function ProjectsPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const openProject = (id: string) => navigate(`/admin/projects/${id}`);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("*").order("display_order").order("created_at", { ascending: false });
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

  const filtered = useMemo(() => {
    if (!search) return projects;
    const s = search.toLowerCase();
    return projects.filter((p: any) => p.name?.toLowerCase().includes(s) || p.category?.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s));
  }, [projects, search]);

  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {};
    PROJECT_STAGES.forEach((s) => (map[s.value] = []));
    filtered.forEach((p: any) => {
      const stage = map[p.stage] ? p.stage : "idea";
      map[stage].push(p);
    });
    return map;
  }, [filtered]);

  const stats = useMemo(() => {
    const totalBudget = projects.reduce((s: number, p: any) => s + Number(p.budget_php || 0), 0);
    const totalActual = projects.reduce((s: number, p: any) => s + Number(p.actual_cost_php || 0), 0);
    const live = projects.filter((p: any) => ["live", "monetized"].includes(p.stage)).length;
    const inProgress = projects.filter((p: any) => ["development", "testing"].includes(p.stage)).length;
    return { totalBudget, totalActual, live, inProgress };
  }, [projects]);

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const newStage = over.id as string;
    const project = projects.find((p: any) => p.id === active.id);
    if (!project || project.stage === newStage) return;

    qc.setQueryData(["projects"], (old: any) => old?.map((p: any) => p.id === active.id ? { ...p, stage: newStage } : p));
    const { error } = await supabase.from("projects").update({ stage: newStage }).eq("id", String(active.id));
    if (error) {
      toast.error(error.message);
      qc.invalidateQueries({ queryKey: ["projects"] });
    } else {
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground">Build pipeline — idea to monetized</p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> New Project
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Live / Monetized</div><p className="text-2xl font-bold mt-1 text-emerald-400">{stats.live}</p></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">In Progress</div><p className="text-2xl font-bold mt-1 text-purple-400">{stats.inProgress}</p></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Total Budget</div><p className="text-lg font-bold mt-1 font-mono">{formatPHP(stats.totalBudget)}</p></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Total Spent</div><p className={`text-lg font-bold mt-1 font-mono ${stats.totalActual > stats.totalBudget ? "text-red-400" : ""}`}>{formatPHP(stats.totalActual)}</p></Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-xs" />
        <div className="flex gap-1 ml-auto">
          <Button size="sm" variant={view === "kanban" ? "default" : "outline"} onClick={() => setView("kanban")}><LayoutGrid className="h-3.5 w-3.5 mr-1" /> Kanban</Button>
          <Button size="sm" variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")}><List className="h-3.5 w-3.5 mr-1" /> List</Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
      ) : view === "kanban" ? (
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
          <div className="flex flex-col lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-3 pb-4">
            {PROJECT_STAGES.map((stage) => (
              <KanbanColumn key={stage.value} stage={stage} projects={grouped[stage.value]} onCardClick={openProject} />
            ))}
          </div>
        </DndContext>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">No projects yet</Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((p: any) => {
            const stage = PROJECT_STAGES.find((s) => s.value === p.stage);
            const over = Number(p.actual_cost_php || 0) > Number(p.budget_php || 0) && Number(p.budget_php) > 0;
            return (
              <Card key={p.id} className="p-4 cursor-pointer hover:border-primary/40 transition-colors space-y-2" onClick={() => openProject(p.id)}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium truncate">{p.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{p.category || "—"}</p>
                  </div>
                  <Badge className={`${stage?.color} shrink-0 text-[10px]`}>{stage?.label}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border">
                  <div>
                    <div className="text-muted-foreground">Budget</div>
                    <div className="font-mono">{formatPHP(Number(p.budget_php))}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Actual</div>
                    <div className={`font-mono ${over ? "text-red-400" : ""}`}>{formatPHP(Number(p.actual_cost_php))}</div>
                  </div>
                </div>
                {p.target_launch && (
                  <div className="text-[11px] text-muted-foreground pt-1">Launch: {p.target_launch}</div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <ProjectFormModal open={formOpen} onOpenChange={setFormOpen} initial={editing} />
    </div>
  );
}
