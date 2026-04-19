export const PIPELINE_STAGES = [
  { id: "prospect", label: "Prospect", color: "bg-muted text-muted-foreground border-border" },
  { id: "contacted", label: "Contacted", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  { id: "demo", label: "Demo Scheduled", color: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
  { id: "negotiating", label: "Negotiating", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  { id: "closed", label: "Closed", color: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  { id: "active", label: "Active", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
] as const;

export type PipelineStage = typeof PIPELINE_STAGES[number]["id"];

export const SERVICE_INTERESTS = [
  "Resort Bot",
  "Menu System",
  "Booking Flow",
  "POS",
  "Staff Timesheet",
  "Inventory",
  "Website",
  "Cloudbeds Integration",
] as const;

export const SOURCES = ["referral", "facebook", "google", "walk-in"] as const;

export interface Client {
  id: string;
  business_name: string;
  contact_name: string | null;
  whatsapp: string | null;
  email: string | null;
  location: string | null;
  facebook_url: string | null;
  business_type: string | null;
  source: string | null;
  pipeline_stage: string;
  service_interests: string[] | null;
  estimated_value_php: number | null;
  monthly_recurring_php: number | null;
  last_contact_date: string | null;
  follow_up_date: string | null;
  pitch_sent_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const fmtPhp = (n: number | null | undefined) =>
  "₱" + new Intl.NumberFormat("en-PH", { maximumFractionDigits: 0 }).format(n || 0);
