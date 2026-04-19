export interface Tool {
  id?: string;
  name: string;
  description: string | null;
  github_url: string | null;
  install_instructions: string | null;
  installed: boolean;
  installed_at: string | null;
  license: string | null;
  monthly_cost_usd: number | null;
  notes: string | null;
  priority_rank: number | null;
  revenue_potential_php: number | null;
  token_burn: string | null;
  use_cases: string[] | null;
}

export const TOKEN_BURN_OPTIONS = [
  { value: "low", label: "Low", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { value: "medium", label: "Medium", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  { value: "high", label: "High", color: "bg-red-500/20 text-red-300 border-red-500/30" },
] as const;

export const emptyTool: Tool = {
  name: "",
  description: "",
  github_url: "",
  install_instructions: "",
  installed: false,
  installed_at: null,
  license: "",
  monthly_cost_usd: 0,
  notes: "",
  priority_rank: 5,
  revenue_potential_php: 0,
  token_burn: "low",
  use_cases: [],
};

export const formatPHP = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n || 0);

export const formatUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);
