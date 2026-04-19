import { useDroppable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "./ProjectCard";

interface Props {
  stage: { value: string; label: string; color: string };
  projects: any[];
  onCardClick: (id: string) => void;
}

export function KanbanColumn({ stage, projects, onCardClick }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id: stage.value });
  return (
    <div className="flex flex-col w-full lg:min-w-[260px] lg:flex-1">
      <div className="flex items-center justify-between mb-2 px-1">
        <Badge className={stage.color}>{stage.label}</Badge>
        <span className="text-xs text-muted-foreground">{projects.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[200px] space-y-2 p-2 rounded-lg border-2 border-dashed transition-colors ${
          isOver ? "border-primary bg-primary/5" : "border-border bg-muted/20"
        }`}
      >
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} onClick={() => onCardClick(p.id)} />
        ))}
        {projects.length === 0 && <p className="text-xs text-muted-foreground text-center py-6">Empty</p>}
      </div>
    </div>
  );
}
