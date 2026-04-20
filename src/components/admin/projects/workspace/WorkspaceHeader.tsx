import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical, Copy, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PROJECT_STAGES } from "@/components/admin/projects/types";

export function WorkspaceHeader({ project }: { project: any }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [name, setName] = useState(project.name);
  const [stage, setStage] = useState(project.stage);
  const [saving, setSaving] = useState(false);
  const dirty = name !== project.name || stage !== project.stage;

  useEffect(() => { setName(project.name); setStage(project.stage); }, [project.id]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("projects").update({ name, stage }).eq("id", project.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["project", project.id] });
    qc.invalidateQueries({ queryKey: ["projects"] });
  };

  const duplicate = async () => {
    const { id, created_at, updated_at, ...rest } = project;
    const { data, error } = await supabase.from("projects").insert({ ...rest, name: `${rest.name} (Copy)` }).select().single();
    if (error) return toast.error(error.message);
    toast.success("Duplicated");
    qc.invalidateQueries({ queryKey: ["projects"] });
    navigate(`/admin/projects/${data.id}`);
  };

  const remove = async () => {
    const { error } = await supabase.from("projects").delete().eq("id", project.id);
    if (error) return toast.error(error.message);
    toast.success("Project deleted");
    qc.invalidateQueries({ queryKey: ["projects"] });
    navigate("/admin/projects");
  };

  return (
    <div className="space-y-3 pb-4 border-b border-border">
      <button onClick={() => navigate("/admin/projects")} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
      </button>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input value={name} onChange={(e) => setName(e.target.value)} className="text-lg font-semibold h-11 sm:max-w-xl" />
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger className="h-11 min-w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PROJECT_STAGES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={save} disabled={!dirty || saving} size="default" className="h-11 min-w-[44px]">
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-11 w-11"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={duplicate}><Copy className="h-4 w-4 mr-2" /> Duplicate</DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                    <AlertDialogDescription>This cannot be undone. All notes, links, files and comments will be removed.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={remove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
