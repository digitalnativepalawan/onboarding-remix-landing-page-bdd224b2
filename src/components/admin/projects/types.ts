export const PROJECT_STAGES = [
  { value: "idea", label: "Idea", color: "bg-muted text-muted-foreground" },
  { value: "research", label: "Research", color: "bg-blue-500/15 text-blue-400" },
  { value: "development", label: "Development", color: "bg-purple-500/15 text-purple-400" },
  { value: "testing", label: "Testing", color: "bg-orange-500/15 text-orange-400" },
  { value: "live", label: "Live", color: "bg-emerald-500/15 text-emerald-400" },
  { value: "monetized", label: "Monetized", color: "bg-yellow-500/15 text-yellow-400" },
] as const;

export type ProjectStage = typeof PROJECT_STAGES[number]["value"];

export const formatPHP = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n || 0);
