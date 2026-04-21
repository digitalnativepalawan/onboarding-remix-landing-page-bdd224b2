import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Receipt } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { LogWorkModal } from "./LogWorkModal";

export function TimelineTab({ projectId }: { projectId: string }) {
  const [filter, setFilter] = useState("all");
  const [logOpen, setLogOpen] = useState(false);
  const { data: events = [] } = useQuery({
    queryKey: ["project-activity", projectId],
    queryFn: async () => {
      const { data } = await supabase.from("activity_log").select("*").eq("entity_id", projectId).order("created_at", { ascending: false }).limit(200);
      return data ?? [];
    },
  });

  const types = Array.from(new Set(events.map((e: any) => e.entity_type)));
  const filtered = filter === "all" ? events : events.filter((e: any) => e.entity_type === filter);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:max-w-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All activity</SelectItem>
            {types.map((t: any) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={() => setLogOpen(true)} variant="secondary" className="w-full sm:w-auto sm:ml-auto">
          <Receipt className="h-4 w-4 mr-1" /> Log billable work
        </Button>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground"><Activity className="h-6 w-6 mx-auto mb-2" />No activity yet.</Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((e: any) => (
            <Card key={e.id} className="p-3 flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-[10px]">{e.entity_type}</Badge>
                  <Badge variant="secondary" className="text-[10px]">{e.action}</Badge>
                  <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(e.created_at), { addSuffix: true })}</span>
                </div>
                <p className="text-sm mt-1">{e.summary}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
      <LogWorkModal open={logOpen} onClose={() => setLogOpen(false)} projectId={projectId} />
    </div>
  );
}
