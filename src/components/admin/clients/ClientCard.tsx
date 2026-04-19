import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Calendar, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Client, fmtPhp } from "./types";
import { format, parseISO } from "date-fns";

interface Props {
  client: Client;
  onClick: () => void;
}

export function ClientCard({ client, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: client.id,
    data: { client },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50 }
    : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        // ignore click if user was dragging
        if (isDragging) return;
        onClick();
      }}
      className={`p-3 cursor-grab active:cursor-grabbing space-y-2 hover:border-primary/50 transition-colors ${
        isDragging ? "opacity-50 shadow-xl" : ""
      }`}
    >
      <div className="space-y-0.5">
        <p className="font-semibold text-sm leading-tight truncate">{client.business_name}</p>
        {client.contact_name && (
          <p className="text-xs text-muted-foreground truncate">{client.contact_name}</p>
        )}
      </div>

      {client.location && (
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{client.location}</span>
        </div>
      )}

      {client.estimated_value_php ? (
        <p className="text-xs font-mono text-emerald-400">{fmtPhp(client.estimated_value_php)}</p>
      ) : null}

      {client.service_interests && client.service_interests.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {client.service_interests.slice(0, 2).map((s) => (
            <span
              key={s}
              className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary"
            >
              {s}
            </span>
          ))}
          {client.service_interests.length > 2 && (
            <span className="text-[9px] text-muted-foreground">
              +{client.service_interests.length - 2}
            </span>
          )}
        </div>
      )}

      {client.last_contact_date && (
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground pt-1 border-t border-border">
          <Calendar className="w-3 h-3" />
          {format(parseISO(client.last_contact_date), "MMM d")}
        </div>
      )}
    </Card>
  );
}
