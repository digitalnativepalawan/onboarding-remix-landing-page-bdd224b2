export const QUOTE_STATUSES = [
  { value: "draft", label: "Draft", color: "bg-muted text-muted-foreground" },
  { value: "sent", label: "Sent", color: "bg-blue-500/15 text-blue-400" },
  { value: "viewed", label: "Viewed", color: "bg-purple-500/15 text-purple-400" },
  { value: "accepted", label: "Accepted", color: "bg-emerald-500/15 text-emerald-400" },
  { value: "rejected", label: "Rejected", color: "bg-red-500/15 text-red-400" },
  { value: "expired", label: "Expired", color: "bg-orange-500/15 text-orange-400" },
] as const;

export type QuoteStatus = typeof QUOTE_STATUSES[number]["value"];

export const SEND_VIA_OPTIONS = [
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "in-person", label: "In Person" },
] as const;

export const PAYMENT_TERMS_OPTIONS = [
  "Due on receipt",
  "Net 7",
  "Net 15",
  "Net 30",
  "50% deposit, 50% on launch",
] as const;

export interface QuoteItemDraft {
  id?: string;
  catalog_item_id: string | null;
  name: string;
  description: string | null;
  qty: number;
  unit_price_php: number;
  line_total_php: number;
  sort_order: number;
}

export interface QuoteDraft {
  id?: string;
  client_id: string | null;
  title: string;
  status: QuoteStatus;
  notes: string | null;
  terms: string | null;
  total_php: number;
  valid_until: string | null;
  sent_via: string | null;
  follow_up_count: number;
  items: QuoteItemDraft[];

  // Invoice fields
  invoice_number?: string | null;
  invoice_date?: string | null;
  due_date?: string | null;
  currency?: string | null;
  tax_rate?: number;
  discount_amount?: number;
  payment_terms?: string | null;
  notes_customer?: string | null;
  notes_internal?: string | null;

  // Payment methods
  payment_cash_enabled?: boolean;
  payment_gcash_enabled?: boolean;
  payment_gcash_number?: string | null;
  payment_qr_enabled?: boolean;
  payment_qr_url?: string | null;
  payment_bank_enabled?: boolean;
  payment_bank_name?: string | null;
  payment_bank_account_name?: string | null;
  payment_bank_account_number?: string | null;
}

export const formatPHP = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n || 0);

export interface QuoteTotals {
  subtotal: number;
  discount: number;
  taxableBase: number;
  taxAmount: number;
  total: number;
}

export function calcTotals(
  items: { line_total_php: number }[],
  taxRate = 0,
  discount = 0,
): QuoteTotals {
  const subtotal = items.reduce((s, i) => s + (Number(i.line_total_php) || 0), 0);
  const safeDiscount = Math.max(0, Math.min(discount || 0, subtotal));
  const taxableBase = subtotal - safeDiscount;
  const taxAmount = taxableBase * ((Number(taxRate) || 0) / 100);
  const total = taxableBase + taxAmount;
  return { subtotal, discount: safeDiscount, taxableBase, taxAmount, total };
}

export function nextInvoiceNumber(existing: string[]): string {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;
  const nums = existing
    .filter((n) => n?.startsWith(prefix))
    .map((n) => parseInt(n.slice(prefix.length), 10))
    .filter((n) => Number.isFinite(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `${prefix}${String(next).padStart(4, "0")}`;
}
