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
import { Trash2, Plus, ChevronLeft, ChevronRight, Check, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  QuoteDraft,
  QuoteItemDraft,
  SEND_VIA_OPTIONS,
  PAYMENT_TERMS_OPTIONS,
  formatPHP,
  calcTotals,
  nextInvoiceNumber,
} from "./types";
import { generateQuotePDF } from "./pdf";
import PaymentsStep from "./PaymentsStep";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: QuoteDraft | null;
}

const STEPS = ["Client", "Catalog", "Custom", "Invoice", "Payments", "Notes", "Review", "Send"];

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
  invoice_number: null,
  invoice_date: null,
  due_date: null,
  currency: "PHP",
  tax_rate: 0,
  discount_amount: 0,
  payment_terms: "Due on receipt",
  notes_customer: "",
  notes_internal: "",
  payment_cash_enabled: true,
  payment_gcash_enabled: true,
  payment_gcash_number: null,
  payment_qr_enabled: true,
  payment_qr_url: null,
  payment_bank_enabled: true,
  payment_bank_name: null,
  payment_bank_account_name: null,
  payment_bank_account_number: null,
};

export function QuoteWizardModal({ open, onOpenChange, initial }: Props) {
  const qc = useQueryClient();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<QuoteDraft>(emptyDraft);
  const [saving, setSaving] = useState(false);

  // Pull defaults from site_settings for payment methods on a new quote
  const { data: siteSettings } = useQuery({
    queryKey: ["site-settings-quote-defaults"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("id", "default").maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (open) {
      setStep(0);
      let base: QuoteDraft = initial
        ? { ...emptyDraft, ...initial, items: [...initial.items] }
        : { ...emptyDraft, items: [] };

      // For brand-new quotes, seed payment defaults from site_settings (if any)
      if (!initial && siteSettings) {
        base = {
          ...base,
          payment_gcash_number: base.payment_gcash_number ?? null,
        };
      }

      // Pull a prefill item from sessionStorage (e.g. "Add to Quote" from Catalog)
      try {
        const raw = sessionStorage.getItem("quote-prefill-item");
        if (raw && !initial) {
          const p = JSON.parse(raw);
          base = {
            ...base,
            items: [
              ...base.items,
              {
                catalog_item_id: p.catalog_item_id ?? null,
                name: p.name ?? "",
                description: p.description ?? "",
                qty: 1,
                unit_price_php: Number(p.unit_price_php) || 0,
                line_total_php: Number(p.unit_price_php) || 0,
                sort_order: base.items.length,
              },
            ],
          };
          sessionStorage.removeItem("quote-prefill-item");
        }
      } catch {
        // ignore
      }
      setDraft(base);
    }
  }, [open, initial, siteSettings]);

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

  const totals = useMemo(
    () => calcTotals(draft.items, draft.tax_rate, draft.discount_amount),
    [draft.items, draft.tax_rate, draft.discount_amount],
  );

  useEffect(() => {
    setDraft((d) => ({ ...d, total_php: totals.total }));
  }, [totals.total]);

  const patch = (p: Partial<QuoteDraft>) => setDraft((d) => ({ ...d, ...p }));

  const generateInvoiceNumber = async () => {
    const { data } = await supabase.from("quotes").select("invoice_number").not("invoice_number", "is", null);
    const existing = (data ?? []).map((r: any) => r.invoice_number).filter(Boolean) as string[];
    patch({ invoice_number: nextInvoiceNumber(existing) });
  };

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
    patch({ items: [...draft.items, item] });
  };

  const addCustomItem = () => {
    patch({
      items: [
        ...draft.items,
        { catalog_item_id: null, name: "", description: "", qty: 1, unit_price_php: 0, line_total_php: 0, sort_order: draft.items.length },
      ],
    });
  };

  const updateItem = (idx: number, p: Partial<QuoteItemDraft>) => {
    const items = [...draft.items];
    const merged = { ...items[idx], ...p };
    merged.line_total_php = (Number(merged.qty) || 0) * (Number(merged.unit_price_php) || 0);
    items[idx] = merged;
    patch({ items });
  };

  const removeItem = (idx: number) => patch({ items: draft.items.filter((_, i) => i !== idx) });

  const canNext = () => {
    if (step === 0) return draft.client_id && draft.title.trim().length > 0;
    if (step >= 1 && step <= 6) return draft.items.length > 0;
    return true;
  };

  const saveQuote = async (markSent: boolean): Promise<string | null> => {
    setSaving(true);
    try {
      const status = markSent ? "sent" : draft.status;
      const payload: any = {
        client_id: draft.client_id,
        title: draft.title,
        status,
        notes: draft.notes,
        terms: draft.terms,
        total_php: totals.total,
        valid_until: draft.valid_until,
        sent_via: draft.sent_via,
        invoice_number: draft.invoice_number || null,
        invoice_date: draft.invoice_date || null,
        due_date: draft.due_date || null,
        currency: draft.currency || "PHP",
        subtotal_php: totals.subtotal,
        tax_rate: Number(draft.tax_rate) || 0,
        tax_amount: totals.taxAmount,
        discount_amount: Number(draft.discount_amount) || 0,
        total_amount: totals.total,
        payment_terms: draft.payment_terms,
        notes_customer: draft.notes_customer,
        notes_internal: draft.notes_internal,
        payment_cash_enabled: !!draft.payment_cash_enabled,
        payment_gcash_enabled: !!draft.payment_gcash_enabled,
        payment_gcash_number: draft.payment_gcash_number,
        payment_qr_enabled: !!draft.payment_qr_enabled,
        payment_qr_url: draft.payment_qr_url,
        payment_bank_enabled: !!draft.payment_bank_enabled,
        payment_bank_name: draft.payment_bank_name,
        payment_bank_account_name: draft.payment_bank_account_name,
        payment_bank_account_number: draft.payment_bank_account_number,
      };

      if (markSent) {
        payload.last_sent_date = new Date().toISOString();
      }

      let quoteId = draft.id;
      if (quoteId) {
        if (markSent) {
          // increment sent_count atomically via fresh read
          const { data: cur } = await supabase.from("quotes").select("sent_count").eq("id", quoteId).single();
          payload.sent_count = (cur?.sent_count || 0) + 1;
        }
        const { error } = await supabase.from("quotes").update(payload).eq("id", quoteId);
        if (error) throw error;
        await supabase.from("quote_items").delete().eq("quote_id", quoteId);
      } else {
        if (markSent) payload.sent_count = 1;
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

  const buildBranding = () => ({
    companyName: siteSettings?.company_name,
    tagline: siteSettings?.tagline,
    addressLine: siteSettings?.address_line,
    city: siteSettings?.city,
    province: siteSettings?.province,
    postalCode: siteSettings?.postal_code,
    country: siteSettings?.country,
    email: siteSettings?.contact_email,
    phone: siteSettings?.contact_phone,
    copyrightHolder: siteSettings?.copyright_holder,
    logoUrl: siteSettings?.logo_main_url || siteSettings?.logo_dark_url || siteSettings?.logo_light_url,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{draft.id ? "Edit Quote" : "New Quote"}</DialogTitle>
          <div className="flex gap-1 mt-3">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1">
                <div className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`} />
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
                <Select value={draft.client_id ?? ""} onValueChange={(v) => patch({ client_id: v })}>
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
                <Input value={draft.title} onChange={(e) => patch({ title: e.target.value })} placeholder="e.g. Resort website + booking integration" />
              </div>
              <div>
                <Label>Valid Until</Label>
                <Input type="date" value={draft.valid_until ?? ""} onChange={(e) => patch({ valid_until: e.target.value || null })} />
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

          {/* STEP 3: Invoice */}
          {step === 3 && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Invoice Number</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="INV-2026-0001 (optional)"
                      value={draft.invoice_number ?? ""}
                      onChange={(e) => patch({ invoice_number: e.target.value || null })}
                    />
                    <Button type="button" size="sm" variant="outline" onClick={generateInvoiceNumber}>
                      <Sparkles className="h-3 w-3 mr-1" /> Auto
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Leave blank for a quote. Add a number to convert to an invoice.
                  </p>
                </div>
                <div>
                  <Label className="text-xs">Currency</Label>
                  <Input
                    value={draft.currency ?? "PHP"}
                    onChange={(e) => patch({ currency: e.target.value.toUpperCase() })}
                    maxLength={3}
                  />
                </div>
                <div>
                  <Label className="text-xs">Invoice Date</Label>
                  <Input
                    type="date"
                    value={draft.invoice_date ?? ""}
                    onChange={(e) => patch({ invoice_date: e.target.value || null })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Due Date</Label>
                  <Input
                    type="date"
                    value={draft.due_date ?? ""}
                    onChange={(e) => patch({ due_date: e.target.value || null })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Payment Terms</Label>
                  <Select
                    value={draft.payment_terms ?? ""}
                    onValueChange={(v) => patch({ payment_terms: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="Choose terms" /></SelectTrigger>
                    <SelectContent>
                      {PAYMENT_TERMS_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Tax Rate (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.01}
                    value={draft.tax_rate ?? 0}
                    onChange={(e) => patch({ tax_rate: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Discount (₱)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={draft.discount_amount ?? 0}
                    onChange={(e) => patch({ discount_amount: Number(e.target.value) })}
                  />
                </div>
              </div>

              <Card className="p-3 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">{formatPHP(totals.subtotal)}</span></div>
                {totals.discount > 0 && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="font-mono text-destructive">- {formatPHP(totals.discount)}</span></div>
                )}
                {(draft.tax_rate || 0) > 0 && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Tax ({draft.tax_rate}%)</span><span className="font-mono">{formatPHP(totals.taxAmount)}</span></div>
                )}
                <div className="flex justify-between border-t pt-2 font-semibold"><span>Total</span><span className="font-mono text-primary">{formatPHP(totals.total)}</span></div>
              </Card>
            </div>
          )}

          {/* STEP 4: Payments */}
          {step === 4 && <PaymentsStep draft={draft} onChange={patch} />}

          {/* STEP 5: Notes/Terms */}
          {step === 5 && (
            <div className="space-y-4 py-2">
              <div>
                <Label>Customer-Facing Notes</Label>
                <Textarea
                  rows={3}
                  value={draft.notes_customer ?? ""}
                  onChange={(e) => patch({ notes_customer: e.target.value })}
                  placeholder="Thank-you message, scope summary, deliverables…"
                />
              </div>
              <div>
                <Label>Internal Notes (not on PDF)</Label>
                <Textarea
                  rows={3}
                  value={draft.notes_internal ?? ""}
                  onChange={(e) => patch({ notes_internal: e.target.value })}
                  placeholder="Reminders, context, follow-up plan…"
                />
              </div>
              <div>
                <Label>Terms</Label>
                <Textarea rows={4} value={draft.terms ?? ""} onChange={(e) => patch({ terms: e.target.value })} />
              </div>
            </div>
          )}

          {/* STEP 6: Review */}
          {step === 6 && (
            <div className="space-y-3 py-2">
              <Card className="p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Client</span><span className="font-medium">{clientName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Title</span><span className="font-medium">{draft.title}</span></div>
                {draft.invoice_number && <div className="flex justify-between"><span className="text-muted-foreground">Invoice #</span><span>{draft.invoice_number}</span></div>}
                {draft.invoice_date && <div className="flex justify-between"><span className="text-muted-foreground">Issued</span><span>{draft.invoice_date}</span></div>}
                {draft.due_date && <div className="flex justify-between"><span className="text-muted-foreground">Due</span><span>{draft.due_date}</span></div>}
                {draft.valid_until && <div className="flex justify-between"><span className="text-muted-foreground">Valid Until</span><span>{draft.valid_until}</span></div>}
                {draft.payment_terms && <div className="flex justify-between"><span className="text-muted-foreground">Terms</span><span>{draft.payment_terms}</span></div>}
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
                <div className="border-t mt-3 pt-3 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">{formatPHP(totals.subtotal)}</span></div>
                  {totals.discount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="font-mono">- {formatPHP(totals.discount)}</span></div>}
                  {(draft.tax_rate || 0) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span className="font-mono">{formatPHP(totals.taxAmount)}</span></div>}
                  <div className="flex justify-between font-bold border-t pt-2"><span>Total</span><span className="font-mono text-primary">{formatPHP(totals.total)}</span></div>
                </div>
              </Card>
              <Card className="p-4 text-sm">
                <p className="text-xs uppercase text-muted-foreground mb-2">Payment Methods</p>
                <ul className="space-y-1">
                  {draft.payment_cash_enabled && <li>• Cash</li>}
                  {draft.payment_gcash_enabled && <li>• GCash {draft.payment_gcash_number ? `· ${draft.payment_gcash_number}` : ""}</li>}
                  {draft.payment_qr_enabled && draft.payment_qr_url && <li>• QR Code</li>}
                  {draft.payment_bank_enabled && <li>• Bank Transfer {draft.payment_bank_name ? `· ${draft.payment_bank_name}` : ""}</li>}
                  {!draft.payment_cash_enabled && !draft.payment_gcash_enabled && !draft.payment_qr_enabled && !draft.payment_bank_enabled && (
                    <li className="text-muted-foreground">None enabled</li>
                  )}
                </ul>
              </Card>
            </div>
          )}

          {/* STEP 7: Send */}
          {step === 7 && (
            <div className="space-y-4 py-2">
              <div>
                <Label>Send Via</Label>
                <Select value={draft.sent_via ?? ""} onValueChange={(v) => patch({ sent_via: v })}>
                  <SelectTrigger><SelectValue placeholder="How will you deliver this?" /></SelectTrigger>
                  <SelectContent>
                    {SEND_VIA_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Card className="p-4 bg-muted/40">
                <p className="text-sm font-medium mb-2">Ready to send</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Generates a {draft.invoice_number ? "branded invoice" : "quote"} PDF and marks as
                  <Badge variant="outline" className="ml-1">sent</Badge>
                </p>
                <Button
                  className="w-full"
                  disabled={saving || !draft.sent_via}
                  onClick={async () => {
                    const id = await saveQuote(true);
                    if (id) {
                      await generateQuotePDF({ ...draft, total_php: totals.total, id }, clientName, buildBranding());
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
