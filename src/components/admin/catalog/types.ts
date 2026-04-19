export const CATALOG_CATEGORIES = [
  { value: "website", label: "Website" },
  { value: "booking", label: "Booking" },
  { value: "ordering", label: "Ordering" },
  { value: "ops", label: "Operations" },
  { value: "marketing", label: "Marketing" },
  { value: "other", label: "Other" },
] as const;

export interface CatalogItem {
  id?: string;
  name: string;
  description: string | null;
  category: string | null;
  base_price_php: number;
  setup_days: number;
  features: string[];
  tech_stack: string[];
  screenshots: string[];
  demo_url: string | null;
  is_active: boolean;
  display_order: number;
}

export const emptyCatalogItem: CatalogItem = {
  name: "",
  description: "",
  category: "website",
  base_price_php: 0,
  setup_days: 7,
  features: [],
  tech_stack: [],
  screenshots: [],
  demo_url: "",
  is_active: true,
  display_order: 0,
};

export const formatPHP = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n || 0);
