import { useDroppable } from "@dnd-kit/core";
import { Client, PIPELINE_STAGES } from "./types";
import { ClientCard } from "./ClientCard";

interface Props {
  stage: typeof PIPELINE_STAGES[number];
  clients: Client[];
  onCardClick: (c: Client) => void;
}

export function KanbanColumn({ stage, clients, onCardClick }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  return (
    <div className="flex flex-col w-72 shrink-0">
      <div className={`px-3 py-2 rounded-t-md border ${stage.color} flex items-center justify-between`}>
        <span className="text-xs font-semibold uppercase tracking-wide">{stage.label}</span>
        <span className="text-xs font-mono">{clients.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[300px] p-2 space-y-2 bg-muted/20 rounded-b-md border border-t-0 border-border transition-colors ${
          isOver ? "bg-primary/5 border-primary/30" : ""
        }`}
      >
        {clients.length === 0 ? (
          <p className="text-[11px] text-muted-foreground text-center py-6">Drop clients here</p>
        ) : (
          clients.map((c) => (
            <ClientCard key={c.id} client={c} onClick={() => onCardClick(c)} />
          ))
        )}
      </div>
    </div>
  );
}
