import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Plus, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QuoteDraft, QuoteItemDraft, SEND_VIA_OPTIONS, formatPHP } from "./types";
import { generateQuotePDF } from "./pdf";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: QuoteDraft | null;
}

const STEPS = ["Client", "Catalog", "Custom", "Notes", "Review", "Send"];

const emptyDraft: QuoteDraft = {
  client_id: null,
  title: "",
  status: "draft",
  notes: "",
  terms: "Valid for 30 days. 50% deposit required to start. Final payment on launch.",
  total_php: 0,
  valid_until: null,
  sent_via: null,
  follow_up_count: 0,
  items: [],
};

export function QuoteWizardModal({ open, onOpenChange, initial }: Props) {
  const qc = useQueryClient();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<QuoteDraft>(emptyDraft);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(0);
      setDraft(initial ? { ...initial, items: [...initial.items] } : emptyDraft);
    }
  }, [open, initial]);

  const { data: clients = [] } = useQuery({
    queryKey: ["quote-clients"],
    queryFn: async () => {
      const { data } = await supabase.from("clients").select("id,business_name,contact_name").order("business_name");
      return data ?? [];
    },
  });

  const { data: catalog = [] } = useQuery({
    queryKey: ["quote-catalog"],
    queryFn: async () => {
      const { data } = await supabase.from("catalog_items").select("*").eq("is_active", true).order("display_order");
      return data ?? [];
    },
  });

  const total = useMemo(() => draft.items.reduce((s, i) => s + i.line_total_php, 0), [draft.items]);

  useEffect(() => {
    setDraft((d) => ({ ...d, total_php: total }));
  }, [total]);

  const addCatalogItem = (cat: any) => {
    const item: QuoteItemDraft = {
      catalog_item_id: cat.id,
      name: cat.name,
      description: cat.description ?? "",
      qty: 1,
      unit_price_php: Number(cat.base_price_php) || 0,
      line_total_php: Number(cat.base_price_php) || 0,
      sort_order: draft.items.length,
    };
    setDraft({ ...draft, items: [...draft.items, item] });
  };

  const addCustomItem = () => {
    setDraft({
      ...draft,
      items: [
        ...draft.items,
        { catalog_item_id: null, name: "", description: "", qty: 1, unit_price_php: 0, line_total_php: 0, sort_order: draft.items.length },
      ],
    });
  };

  const updateItem = (idx: number, patch: Partial<QuoteItemDraft>) => {
    const items = [...draft.items];
    const merged = { ...items[idx], ...patch };
    merged.line_total_php = (Number(merged.qty) || 0) * (Number(merged.unit_price_php) || 0);
    items[idx] = merged;
    setDraft({ ...draft, items });
  };

  const removeItem = (idx: number) => {
    setDraft({ ...draft, items: draft.items.filter((_, i) => i !== idx) });
  };

  const canNext = () => {
    if (step === 0) return draft.client_id && draft.title.trim().length > 0;
    if (step === 4 || step === 3 || step === 2 || step === 1) return draft.items.length > 0;
    return true;
  };

  const saveQuote = async (markSent: boolean): Promise<string | null> => {
    setSaving(true);
    try {
      const status = markSent ? "sent" : draft.status;
      const payload = {
        client_id: draft.client_id,
        title: draft.title,
        status,
        notes: draft.notes,
        terms: draft.terms,
        total_php: total,
        valid_until: draft.valid_until,
        sent_via: markSent ? draft.sent_via : draft.sent_via,
      };

      let quoteId = draft.id;
      if (quoteId) {
        const { error } = await supabase.from("quotes").update(payload).eq("id", quoteId);
        if (error) throw error;
        await supabase.from("quote_items").delete().eq("quote_id", quoteId);
      } else {
        const { data, error } = await supabase.from("quotes").insert(payload).select("id").single();
        if (error) throw error;
        quoteId = data.id;
      }

      if (draft.items.length) {
        const rows = draft.items.map((it, i) => ({
          quote_id: quoteId!,
          catalog_item_id: it.catalog_item_id,
          name: it.name,
          description: it.description,
          qty: it.qty,
          unit_price_php: it.unit_price_php,
          line_total_php: it.line_total_php,
          sort_order: i,
        }));
        const { error } = await supabase.from("quote_items").insert(rows);
        if (error) throw error;
      }

      qc.invalidateQueries({ queryKey: ["quotes"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(markSent ? "Quote sent" : "Quote saved");
      return quoteId!;
    } catch (e: any) {
      toast.error(e.message || "Failed to save quote");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const clientName = clients.find((c: any) => c.id === draft.client_id)?.business_name || "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{draft.id ? "Edit Quote" : "New Quote"}</DialogTitle>
          <div className="flex gap-1 mt-3">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1 flex items-center gap-1">
                <div
                  className={`flex-1 h-1.5 rounded-full transition-colors ${
                    i <= step ? "bg-primary" : "bg-muted"
                  }`}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Step {step + 1} of {STEPS.length}: <span className="text-foreground font-medium">{STEPS[step]}</span>
          </p>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-3">
          {/* STEP 0: Client */}
          {step === 0 && (
            <div className="space-y-4 py-2">
              <div>
                <Label>Client *</Label>
                <Select value={draft.client_id ?? ""} onValueChange={(v) => setDraft({ ...draft, client_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>
                    {clients.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>{c.business_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quote Title *</Label>
                <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Resort website + booking integration" />
              </div>
              <div>
                <Label>Valid Until</Label>
                <Input type="date" value={draft.valid_until ?? ""} onChange={(e) => setDraft({ ...draft, valid_until: e.target.value || null })} />
              </div>
            </div>
          )}

          {/* STEP 1: Catalog */}
          {step === 1 && (
            <div className="space-y-3 py-2">
              <p className="text-sm text-muted-foreground">Click to add catalog items</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {catalog.map((c: any) => (
                  <Card key={c.id} className="p-3 cursor-pointer hover:border-primary transition-colors" onClick={() => addCatalogItem(c)}>
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                      </div>
                      <Plus className="h-4 w-4 shrink-0 text-primary" />
                    </div>
                    <p className="text-xs mt-2 font-mono">{formatPHP(c.base_price_php)}</p>
                  </Card>
                ))}
              </div>
              {draft.items.length > 0 && (
                <div className="border-t pt-3 space-y-2">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Added ({draft.items.length})</p>
                  {draft.items.map((it, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm bg-muted/40 rounded px-2 py-1">
                      <span className="flex-1 truncate">{it.name}</span>
                      <span className="font-mono text-xs">{formatPHP(it.line_total_php)}</span>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeItem(i)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Custom + edit */}
          {step === 2 && (
            <div className="space-y-3 py-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Edit quantities, prices, or add custom line items</p>
                <Button size="sm" variant="outline" onClick={addCustomItem}>
                  <Plus className="h-3 w-3 mr-1" /> Custom
                </Button>
              </div>
              {draft.items.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">No items yet</p>
              ) : (
                <div className="space-y-2">
                  {draft.items.map((it, i) => (
                    <Card key={i} className="p-3 space-y-2">
                      <div className="flex gap-2">
                        <Input className="flex-1" placeholder="Name" value={it.name} onChange={(e) => updateItem(i, { name: e.target.value })} />
                        <Button size="icon" variant="ghost" onClick={() => removeItem(i)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea rows={2} placeholder="Description" value={it.description ?? ""} onChange={(e) => updateItem(i, { description: e.target.value })} />
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs">Qty</Label>
                          <Input type="number" min={0} value={it.qty} onChange={(e) => updateItem(i, { qty: Number(e.target.value) })} />
                        </div>
                        <div>
                          <Label className="text-xs">Unit (₱)</Label>
                          <Input type="number" min={0} value={it.unit_price_php} onChange={(e) => updateItem(i, { unit_price_php: Number(e.target.value) })} />
                        </div>
                        <div>
                          <Label className="text-xs">Total</Label>
                          <Input readOnly value={formatPHP(it.line_total_php)} className="font-mono" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Notes/Terms */}
          {step === 3 && (
            <div className="space-y-4 py-2">
              <div>
                <Label>Internal & Client Notes</Label>
                <Textarea rows={4} value={draft.notes ?? ""} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} placeholder="Scope details, deliverables, exclusions..." />
              </div>
              <div>
                <Label>Terms</Label>
                <Textarea rows={5} value={draft.terms ?? ""} onChange={(e) => setDraft({ ...draft, terms: e.target.value })} />
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && (
            <div className="space-y-3 py-2">
              <Card className="p-4 space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground text-sm">Client</span><span className="font-medium">{clientName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground text-sm">Title</span><span className="font-medium">{draft.title}</span></div>
                {draft.valid_until && <div className="flex justify-between"><span className="text-muted-foreground text-sm">Valid Until</span><span>{draft.valid_until}</span></div>}
              </Card>
              <Card className="p-4">
                <p className="text-xs uppercase text-muted-foreground mb-2">Line Items</p>
                <div className="space-y-1.5">
                  {draft.items.map((it, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="truncate flex-1">{it.qty} × {it.name}</span>
                      <span className="font-mono">{formatPHP(it.line_total_php)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="font-mono text-primary">{formatPHP(total)}</span>
                </div>
              </Card>
            </div>
          )}

          {/* STEP 5: Send */}
          {step === 5 && (
            <div className="space-y-4 py-2">
              <div>
                <Label>Send Via</Label>
                <Select value={draft.sent_via ?? ""} onValueChange={(v) => setDraft({ ...draft, sent_via: v })}>
                  <SelectTrigger><SelectValue placeholder="How will you deliver this?" /></SelectTrigger>
                  <SelectContent>
                    {SEND_VIA_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Card className="p-4 bg-muted/40">
                <p className="text-sm font-medium mb-2">Ready to send</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Generates a PDF and marks the quote as <Badge variant="outline" className="ml-1">sent</Badge>
                </p>
                <Button
                  className="w-full"
                  disabled={saving || !draft.sent_via}
                  onClick={async () => {
                    const id = await saveQuote(true);
                    if (id) {
                      generateQuotePDF({ ...draft, total_php: total, id }, clientName);
                      onOpenChange(false);
                    }
                  }}
                >
                  <Check className="h-4 w-4 mr-2" /> Generate PDF & Mark Sent
                </Button>
              </Card>
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="flex-row justify-between gap-2 border-t pt-3">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button variant="ghost" onClick={async () => { const id = await saveQuote(false); if (id) onOpenChange(false); }} disabled={saving || !draft.title || !draft.client_id}>
              Save Draft
            </Button>
          </div>
          {step < STEPS.length - 1 && (
            <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
