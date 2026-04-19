export type ExpenseCategory =
  | "subscriptions"
  | "office"
  | "telecom"
  | "utilities"
  | "marketing"
  | "development"
  | "professional"
  | "transportation"
  | "equipment"
  | "miscellaneous";

export type PaymentMethod =
  | "cash"
  | "gcash"
  | "maya"
  | "credit_card"
  | "debit_card"
  | "bank_transfer";

export type ExpenseStatus = "pending" | "approved" | "rejected";
export type ExpenseType = "one_time" | "recurring";
export type RecurringFrequency = "monthly" | "quarterly" | "yearly";

export interface ExpenseRow {
  id: string;
  expense_name: string;
  description: string | null;
  category: ExpenseCategory | string;
  amount: number;
  currency: string;
  amount_php: number | null;
  expense_date: string;
  created_at: string;
  updated_at: string;
  payment_method: PaymentMethod | string | null;
  payment_reference: string | null;
  receipt_path: string | null;
  receipt_url: string | null;
  expense_type: ExpenseType | string;
  is_billable: boolean;
  is_recurring: boolean;
  recurring_frequency: RecurringFrequency | string | null;
  next_recurring_date: string | null;
  client_id: string | null;
  project_id: string | null;
  quote_id: string | null;
  status: ExpenseStatus | string;
  approved_by: string | null;
  approved_at: string | null;
  tags: string[] | null;
  notes: string | null;
  vendor_name: string | null;
  invoice_number: string | null;
}

export const CATEGORY_OPTIONS: { value: ExpenseCategory; label: string }[] = [
  { value: "subscriptions", label: "Subscriptions" },
  { value: "office", label: "Office" },
  { value: "telecom", label: "Telecom" },
  { value: "utilities", label: "Utilities" },
  { value: "marketing", label: "Marketing" },
  { value: "development", label: "Development" },
  { value: "professional", label: "Professional" },
  { value: "transportation", label: "Transportation" },
  { value: "equipment", label: "Equipment" },
  { value: "miscellaneous", label: "Miscellaneous" },
];

export const PAYMENT_METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "gcash", label: "GCash" },
  { value: "maya", label: "Maya" },
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
];

export const CATEGORY_COLORS: Record<string, string> = {
  subscriptions: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  office: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  telecom: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  utilities: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  marketing: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  development: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  professional: "bg-teal-500/15 text-teal-400 border-teal-500/30",
  transportation: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  equipment: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  miscellaneous: "bg-slate-500/15 text-slate-400 border-slate-500/30",
};
