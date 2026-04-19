import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PROJECT_STAGES, formatPHP } from "./types";
import { Edit, Trash2, ExternalLink, Github, Plus, Calendar, Users } from "lucide-react";

interface Props {
  projectId: string | null;
  onOpenChange: (o: boolean) => void;
  onEdit: () => void;
}

const NOTE_TYPES = ["note", "todo", "blocker", "decision"];

export function ProjectDetailModal({ projectId, onOpenChange, onEdit }: Props) {
  const qc = useQueryClient();
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState("note");

  const { data: project } = useQuery({
    queryKey: ["project-detail", projectId],
    queryFn: async () => {
      if (!projectId) return null;
      const { data } = await supabase.from("projects").select("*").eq("id", projectId).single();
      return data;
    },
    enabled: !!projectId,
  });

  const { data: notes = [] } = useQuery({
    queryKey: ["project-notes", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data } = await supabase.from("notes").select("*").eq("project_id", projectId).order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!projectId,
  });

  if (!project) return null;

  const stage = PROJECT_STAGES.find((s) => s.value === project.stage);
  const budget = Number(project.budget_php || 0);
  const actual = Number(project.actual_cost_php || 0);
  const overBudget = budget > 0 && actual > budget;

  const addNote = async () => {
    if (!newNote.trim()) return;
    const { error } = await supabase.from("notes").insert({
      title: newNote.slice(0, 80),
      content: newNote,
      type: noteType,
      project_id: projectId!,
    });
    if (error) return toast.error(error.message);
    setNewNote("");
    qc.invalidateQueries({ queryKey: ["project-notes", projectId] });
  };

  const deleteNote = async (id: string) => {
    await supabase.from("notes").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["project-notes", projectId] });
  };

  const deleteProject = async () => {
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", project.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["projects"] });
    onOpenChange(false);
  };

  const urls = [
    { label: "Live", url: project.live_url, icon: ExternalLink },
    { label: "GitHub", url: project.github_url, icon: Github },
    { label: "Lovable", url: project.lovable_url, icon: ExternalLink },
    { label: "Vercel", url: project.vercel_url, icon: ExternalLink },
  ].filter((u) => u.url);

  return (
    <Dialog open={!!projectId} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle>{project.name}</DialogTitle>
              {project.category && <p className="text-sm text-muted-foreground mt-1">{project.category}</p>}
            </div>
            <Badge className={stage?.color}>{stage?.label}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {project.description && <p className="text-sm text-muted-foreground">{project.description}</p>}

          {/* Budget */}
          {budget > 0 && (
            <Card className="p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Budget vs Actual</span>
                <span className={overBudget ? "text-red-400 font-mono font-semibold" : "font-mono font-semibold"}>
                  {formatPHP(actual)} / {formatPHP(budget)}
                </span>
              </div>
              <div className="h-2 bg-muted rounded overflow-hidden">
                <div className={`h-full ${overBudget ? "bg-red-500" : "bg-primary"}`} style={{ width: `${Math.min(100, (actual / budget) * 100)}%` }} />
              </div>
              {overBudget && <p className="text-xs text-red-400 mt-2">Over budget by {formatPHP(actual - budget)}</p>}
            </Card>
          )}

          {/* Dates */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <Card className="p-3"><div className="text-muted-foreground">Start</div><div className="font-medium mt-0.5">{project.start_date || "—"}</div></Card>
            <Card className="p-3"><div className="text-muted-foreground">Target</div><div className="font-medium mt-0.5">{project.target_launch || "—"}</div></Card>
            <Card className="p-3"><div className="text-muted-foreground">Launched</div><div className="font-medium mt-0.5">{project.actual_launch || "—"}</div></Card>
          </div>

          {/* URLs */}
          {urls.length > 0 && (
            <Card className="p-3">
              <p className="text-xs uppercase text-muted-foreground mb-2">Links</p>
              <div className="flex flex-wrap gap-2">
                {urls.map((u) => (
                  <a key={u.label} href={u.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded bg-muted hover:bg-muted/70">
                    <u.icon className="h-3 w-3" /> {u.label}
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Tech & Team */}
          {(project.tech_stack?.length || project.team_members?.length) && (
            <div className="grid sm:grid-cols-2 gap-3">
              {project.tech_stack?.length > 0 && (
                <Card className="p-3">
                  <p className="text-xs uppercase text-muted-foreground mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-1">
                    {project.tech_stack.map((t: string) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                  </div>
                </Card>
              )}
              {project.team_members?.length > 0 && (
                <Card className="p-3">
                  <p className="text-xs uppercase text-muted-foreground mb-2 flex items-center gap-1"><Users className="h-3 w-3" /> Team</p>
                  <div className="flex flex-wrap gap-1">
                    {project.team_members.map((m: string) => <Badge key={m} variant="outline" className="text-xs">{m}</Badge>)}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Screenshots */}
          {project.screenshots?.length > 0 && (
            <Card className="p-3">
              <p className="text-xs uppercase text-muted-foreground mb-2">Screenshots</p>
              <div className="grid grid-cols-3 gap-2">
                {project.screenshots.map((src: string, i: number) => (
                  <a key={i} href={src} target="_blank" rel="noreferrer">
                    <img src={src} alt={`Screenshot ${i + 1}`} className="rounded border border-border aspect-video object-cover" />
                  </a>
                ))}
              </div>
            </Card>
          )}

          {project.notes && (
            <Card className="p-3">
              <p className="text-xs uppercase text-muted-foreground mb-1">Project Notes</p>
              <p className="text-sm whitespace-pre-wrap">{project.notes}</p>
            </Card>
          )}

          {/* Notes timeline */}
          <Card className="p-3 space-y-3">
            <p className="text-xs uppercase text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Activity & Notes</p>
            <div className="flex gap-2">
              <Select value={noteType} onValueChange={setNoteType}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {NOTE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a note..." onKeyDown={(e) => e.key === "Enter" && addNote()} />
              <Button size="icon" onClick={addNote}><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {notes.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">No notes yet</p>}
              {notes.map((n: any) => (
                <div key={n.id} className="text-sm bg-muted/40 rounded p-2 flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-0.5">
                      <Badge variant="outline" className="text-[10px] py-0">{n.type}</Badge>
                      {new Date(n.created_at).toLocaleString()}
                    </div>
                    <p className="whitespace-pre-wrap">{n.content || n.title}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="h-6 w-6 shrink-0" onClick={() => deleteNote(n.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onEdit}><Edit className="h-4 w-4 mr-2" /> Edit</Button>
            <Button variant="destructive" onClick={deleteProject}><Trash2 className="h-4 w-4 mr-2" /> Delete</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
