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
}

export const formatPHP = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n || 0);
