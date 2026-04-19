import { useDraggable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { ExternalLink, Github, Calendar } from "lucide-react";
import { formatPHP } from "./types";

interface Props {
  project: any;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: project.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  const budget = Number(project.budget_php || 0);
  const actual = Number(project.actual_cost_php || 0);
  const overBudget = budget > 0 && actual > budget;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`p-3 cursor-grab active:cursor-grabbing space-y-2 hover:border-primary transition-colors ${isDragging ? "opacity-50" : ""}`}
    >
      <div>
        <p className="font-medium text-sm leading-tight">{project.name}</p>
        {project.category && <p className="text-xs text-muted-foreground mt-0.5">{project.category}</p>}
      </div>

      {project.description && <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>}

      {budget > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Budget</span>
            <span className={overBudget ? "text-red-400 font-mono" : "font-mono"}>
              {formatPHP(actual)} / {formatPHP(budget)}
            </span>
          </div>
          <div className="h-1 bg-muted rounded overflow-hidden">
            <div
              className={`h-full transition-all ${overBudget ? "bg-red-500" : "bg-primary"}`}
              style={{ width: `${Math.min(100, (actual / budget) * 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {project.github_url && <Github className="h-3 w-3" />}
        {project.live_url && <ExternalLink className="h-3 w-3" />}
        {project.target_launch && (
          <span className="flex items-center gap-1 ml-auto">
            <Calendar className="h-3 w-3" />
            {project.target_launch}
          </span>
        )}
      </div>
    </Card>
  );
}
