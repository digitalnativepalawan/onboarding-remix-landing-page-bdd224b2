import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QUOTE_STATUSES, formatPHP } from "./types";
import { generateQuotePDF } from "./pdf";
import { Download, Edit } from "lucide-react";

interface Props {
  quoteId: string | null;
  onOpenChange: (o: boolean) => void;
  onEdit: () => void;
}

export function QuoteDetailModal({ quoteId, onOpenChange, onEdit }: Props) {
  const { data } = useQuery({
    queryKey: ["quote-detail", quoteId],
    queryFn: async () => {
      if (!quoteId) return null;
      const { data: q } = await supabase.from("quotes").select("*, clients(business_name,contact_name,email,whatsapp)").eq("id", quoteId).single();
      const { data: items } = await supabase.from("quote_items").select("*").eq("quote_id", quoteId).order("sort_order");
      return { ...q, items: items ?? [] };
    },
    enabled: !!quoteId,
  });

  if (!data) return null;
  const status = QUOTE_STATUSES.find((s) => s.value === data.status);

  return (
    <Dialog open={!!quoteId} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle>{data.title}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{data.clients?.business_name}</p>
            </div>
            <Badge className={status?.color}>{status?.label}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">Total: </span><span className="font-mono font-semibold text-primary">{formatPHP(Number(data.total_php))}</span></div>
            <div><span className="text-muted-foreground">Valid: </span>{data.valid_until || "—"}</div>
            <div><span className="text-muted-foreground">Sent via: </span>{data.sent_via || "—"}</div>
            <div><span className="text-muted-foreground">Follow-ups: </span>{data.follow_up_count}</div>
          </div>

          <Card className="p-3">
            <p className="text-xs uppercase text-muted-foreground mb-2">Items</p>
            <div className="space-y-1.5">
              {data.items.map((it: any) => (
                <div key={it.id} className="flex justify-between text-sm">
                  <span className="flex-1 truncate">{it.qty} × {it.name}</span>
                  <span className="font-mono">{formatPHP(Number(it.line_total_php))}</span>
                </div>
              ))}
            </div>
          </Card>

          {data.notes && <Card className="p-3"><p className="text-xs uppercase text-muted-foreground mb-1">Notes</p><p className="text-sm whitespace-pre-wrap">{data.notes}</p></Card>}
          {data.terms && <Card className="p-3"><p className="text-xs uppercase text-muted-foreground mb-1">Terms</p><p className="text-sm whitespace-pre-wrap">{data.terms}</p></Card>}

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onEdit}><Edit className="h-4 w-4 mr-2" /> Edit</Button>
            <Button className="flex-1" onClick={() => generateQuotePDF({
              id: data.id, client_id: data.client_id, title: data.title, status: data.status as any, notes: data.notes,
              terms: data.terms, total_php: Number(data.total_php), valid_until: data.valid_until, sent_via: data.sent_via,
              follow_up_count: data.follow_up_count,
              items: data.items.map((it: any) => ({ ...it, qty: Number(it.qty), unit_price_php: Number(it.unit_price_php), line_total_php: Number(it.line_total_php) })),
            }, data.clients?.business_name || "")}>
              <Download className="h-4 w-4 mr-2" /> PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
