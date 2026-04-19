export const REVENUE_TYPES = [
  { value: "setup", label: "Setup Fee", color: "bg-blue-500/15 text-blue-400" },
  { value: "monthly", label: "Monthly (MRR)", color: "bg-emerald-500/15 text-emerald-400" },
  { value: "addon", label: "Add-on", color: "bg-purple-500/15 text-purple-400" },
  { value: "consulting", label: "Consulting", color: "bg-orange-500/15 text-orange-400" },
  { value: "other", label: "Other", color: "bg-muted text-muted-foreground" },
] as const;

export const REVENUE_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-orange-500/15 text-orange-400" },
  { value: "paid", label: "Paid", color: "bg-emerald-500/15 text-emerald-400" },
  { value: "overdue", label: "Overdue", color: "bg-red-500/15 text-red-400" },
  { value: "cancelled", label: "Cancelled", color: "bg-muted text-muted-foreground" },
] as const;

export const formatPHP = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n || 0);
