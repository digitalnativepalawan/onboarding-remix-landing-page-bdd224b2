import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Pencil, DollarSign, TrendingUp, Calendar, Zap, FileText, BookOpen, StickyNote, Tag } from "lucide-react";
import { Tool, TOKEN_BURN_OPTIONS, formatPHP, formatUSD } from "./types";

type Row = Tool & { id: string };

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  tool: Row | null;
  onEdit: (t: Row) => void;
}

export function ToolDetailModal({ open, onOpenChange, tool, onEdit }: Props) {
  if (!tool) return null;
  const burn = TOKEN_BURN_OPTIONS.find((b) => b.value === tool.token_burn);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto p-0">
        <DialogHeader className="p-5 pb-3 border-b sticky top-0 bg-background z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-xl leading-tight break-words pr-2">{tool.name}</DialogTitle>
              <div className="flex items-center gap-2 flex-wrap mt-2">
                {tool.priority_rank != null && (
                  <Badge variant="outline" className="text-[10px] font-mono">#{tool.priority_rank}</Badge>
                )}
                {tool.installed ? (
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">Installed</Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px]">Wishlist</Badge>
                )}
                {burn && <Badge className={burn.color} variant="outline">Burn: {burn.label}</Badge>}
                {tool.license && (
                  <Badge variant="secondary" className="text-[10px]">{tool.license}</Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 space-y-5">
          {tool.description && (
            <Section icon={<FileText className="h-4 w-4" />} title="Description">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{tool.description}</p>
            </Section>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Stat icon={<DollarSign className="h-3.5 w-3.5" />} label="Cost / mo" value={formatUSD(Number(tool.monthly_cost_usd || 0))} />
            <Stat icon={<TrendingUp className="h-3.5 w-3.5" />} label="Revenue Pot." value={formatPHP(Number(tool.revenue_potential_php || 0))} />
            <Stat icon={<Zap className="h-3.5 w-3.5" />} label="Token Burn" value={burn?.label ?? "—"} />
            <Stat icon={<Calendar className="h-3.5 w-3.5" />} label="Installed On" value={tool.installed_at ? new Date(tool.installed_at).toLocaleDateString() : "—"} />
          </div>

          {tool.use_cases && tool.use_cases.length > 0 && (
            <Section icon={<Tag className="h-4 w-4" />} title="Use Cases">
              <div className="flex flex-wrap gap-1.5">
                {tool.use_cases.map((u, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{u}</Badge>
                ))}
              </div>
            </Section>
          )}

          {tool.install_instructions && (
            <Section icon={<BookOpen className="h-4 w-4" />} title="Install Instructions">
              <pre className="text-xs leading-relaxed whitespace-pre-wrap break-words bg-muted/40 rounded-md p-3 font-mono">
                {tool.install_instructions}
              </pre>
            </Section>
          )}

          {tool.notes && (
            <Section icon={<StickyNote className="h-4 w-4" />} title="Notes">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{tool.notes}</p>
            </Section>
          )}

          {tool.github_url && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Documentation / Source</p>
                <a
                  href={tool.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1.5 break-all"
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  {tool.github_url}
                </a>
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t sticky bottom-0 bg-background flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Close</Button>
          {tool.github_url && (
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <a href={tool.github_url} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4 mr-1.5" /> Open Link
              </a>
            </Button>
          )}
          <Button onClick={() => onEdit(tool)} className="w-full sm:w-auto">
            <Pencil className="h-4 w-4 mr-1.5" /> Edit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
        {icon}
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card/50 p-2.5">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-sm font-mono font-semibold truncate">{value}</p>
    </div>
  );
}