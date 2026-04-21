import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QUOTE_STATUSES, formatPHP, calcTotals } from "./types";
import { generateQuotePDF } from "./pdf";
import { Download, Edit, Banknote, Smartphone, QrCode, Building2 } from "lucide-react";

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
      const { data: q } = await supabase
        .from("quotes")
        .select("*, clients(business_name,contact_name,email,whatsapp)")
        .eq("id", quoteId)
        .single();
      const { data: items } = await supabase
        .from("quote_items")
        .select("*")
        .eq("quote_id", quoteId)
        .order("sort_order");
      const { data: site } = await supabase.from("site_settings").select("*").eq("id", "default").maybeSingle();
      return { ...q, items: items ?? [], site };
    },
    enabled: !!quoteId,
  });

  if (!data) return null;
  const status = QUOTE_STATUSES.find((s) => s.value === data.status);
  const totals = calcTotals(
    data.items.map((it: any) => ({ line_total_php: Number(it.line_total_php) })),
    Number(data.tax_rate) || 0,
    Number(data.discount_amount) || 0,
  );
  const isInvoice = !!data.invoice_number;
  const site = data.site;

  return (
    <Dialog open={!!quoteId} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <DialogTitle className="truncate">{data.title}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{data.clients?.business_name}</p>
              {data.invoice_number && (
                <p className="text-xs font-mono mt-1 text-primary">{data.invoice_number}</p>
              )}
            </div>
            <Badge className={status?.color}>{status?.label}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {data.invoice_date && <div><span className="text-muted-foreground">Issued: </span>{data.invoice_date}</div>}
            {data.due_date && <div><span className="text-muted-foreground">Due: </span>{data.due_date}</div>}
            {data.valid_until && <div><span className="text-muted-foreground">Valid: </span>{data.valid_until}</div>}
            {data.payment_terms && <div><span className="text-muted-foreground">Terms: </span>{data.payment_terms}</div>}
            {data.sent_via && <div><span className="text-muted-foreground">Sent via: </span>{data.sent_via}</div>}
            <div><span className="text-muted-foreground">Follow-ups: </span>{data.follow_up_count}</div>
            {data.sent_count > 0 && <div><span className="text-muted-foreground">Sent count: </span>{data.sent_count}</div>}
          </div>

          {/* Items */}
          <Card className="p-3">
            <p className="text-xs uppercase text-muted-foreground mb-2">Items</p>
            <div className="space-y-1.5">
              {data.items.map((it: any) => (
                <div key={it.id} className="flex justify-between text-sm gap-2">
                  <span className="flex-1 truncate">{it.qty} × {it.name}</span>
                  <span className="font-mono">{formatPHP(Number(it.line_total_php))}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-3 pt-2 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">{formatPHP(totals.subtotal)}</span></div>
              {totals.discount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="font-mono text-destructive">- {formatPHP(totals.discount)}</span></div>}
              {(Number(data.tax_rate) || 0) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Tax ({data.tax_rate}%)</span><span className="font-mono">{formatPHP(totals.taxAmount)}</span></div>}
              <div className="flex justify-between font-bold border-t pt-2"><span>Total</span><span className="font-mono text-primary">{formatPHP(totals.total)}</span></div>
            </div>
          </Card>

          {/* Payment Methods */}
          {(data.payment_cash_enabled || data.payment_gcash_enabled || data.payment_qr_enabled || data.payment_bank_enabled) && (
            <Card className="p-3">
              <p className="text-xs uppercase text-muted-foreground mb-2">Payment methods</p>
              <div className="space-y-1.5 text-sm">
                {data.payment_cash_enabled && (
                  <div className="flex items-center gap-2"><Banknote className="h-3.5 w-3.5 text-primary" /> Cash</div>
                )}
                {data.payment_gcash_enabled && (
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-3.5 w-3.5 text-primary" /> GCash
                    {data.payment_gcash_number && <span className="text-muted-foreground">· {data.payment_gcash_number}</span>}
                  </div>
                )}
                {data.payment_qr_enabled && data.payment_qr_url && (
                  <div className="flex items-start gap-2">
                    <QrCode className="h-3.5 w-3.5 text-primary mt-1" />
                    <img src={data.payment_qr_url} alt="QR" className="w-20 h-20 rounded border bg-white p-1 object-contain" />
                  </div>
                )}
                {data.payment_bank_enabled && (
                  <div className="flex items-start gap-2">
                    <Building2 className="h-3.5 w-3.5 text-primary mt-1" />
                    <div className="text-xs">
                      <div>{data.payment_bank_name || "Bank"}</div>
                      {data.payment_bank_account_name && <div className="text-muted-foreground">{data.payment_bank_account_name}</div>}
                      {data.payment_bank_account_number && <div className="font-mono">{data.payment_bank_account_number}</div>}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {(data.notes_customer || data.notes) && (
            <Card className="p-3">
              <p className="text-xs uppercase text-muted-foreground mb-1">Customer notes</p>
              <p className="text-sm whitespace-pre-wrap">{data.notes_customer || data.notes}</p>
            </Card>
          )}
          {data.notes_internal && (
            <Card className="p-3 border-dashed">
              <p className="text-xs uppercase text-muted-foreground mb-1">Internal notes</p>
              <p className="text-sm whitespace-pre-wrap">{data.notes_internal}</p>
            </Card>
          )}
          {data.terms && (
            <Card className="p-3">
              <p className="text-xs uppercase text-muted-foreground mb-1">Terms</p>
              <p className="text-sm whitespace-pre-wrap">{data.terms}</p>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button
              className="flex-1"
              onClick={() => generateQuotePDF(
                {
                  id: data.id,
                  client_id: data.client_id,
                  title: data.title,
                  status: data.status as any,
                  notes: data.notes,
                  terms: data.terms,
                  total_php: totals.total,
                  valid_until: data.valid_until,
                  sent_via: data.sent_via,
                  follow_up_count: data.follow_up_count,
                  invoice_number: data.invoice_number,
                  invoice_date: data.invoice_date,
                  due_date: data.due_date,
                  currency: data.currency,
                  tax_rate: Number(data.tax_rate) || 0,
                  discount_amount: Number(data.discount_amount) || 0,
                  payment_terms: data.payment_terms,
                  notes_customer: data.notes_customer,
                  notes_internal: data.notes_internal,
                  payment_cash_enabled: data.payment_cash_enabled,
                  payment_gcash_enabled: data.payment_gcash_enabled,
                  payment_gcash_number: data.payment_gcash_number,
                  payment_qr_enabled: data.payment_qr_enabled,
                  payment_qr_url: data.payment_qr_url,
                  payment_bank_enabled: data.payment_bank_enabled,
                  payment_bank_name: data.payment_bank_name,
                  payment_bank_account_name: data.payment_bank_account_name,
                  payment_bank_account_number: data.payment_bank_account_number,
                  items: data.items.map((it: any) => ({
                    ...it,
                    qty: Number(it.qty),
                    unit_price_php: Number(it.unit_price_php),
                    line_total_php: Number(it.line_total_php),
                  })),
                },
                data.clients?.business_name || "",
                {
                  companyName: site?.company_name,
                  tagline: site?.tagline,
                  addressLine: site?.address_line,
                  city: site?.city,
                  province: site?.province,
                  postalCode: site?.postal_code,
                  country: site?.country,
                  email: site?.contact_email,
                  phone: site?.contact_phone,
                  copyrightHolder: site?.copyright_holder,
                  logoUrl: site?.logo_main_url || site?.logo_dark_url || site?.logo_light_url,
                  primaryColor: site?.color_primary,
                },
              )}
            >
              <Download className="h-4 w-4 mr-2" /> {isInvoice ? "Invoice PDF" : "Quote PDF"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
