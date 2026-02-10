import {
  LayoutDashboard,
  MapPin,
  ShoppingCart,
  ScanLine,
  Clock,
  Package,
  Settings,
  Home,
  Users,
  Calendar,
  FileText,
  Database,
  Globe,
  Mail,
  Bell,
  Building2,
  UtensilsCrossed,
  Receipt,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  MapPin,
  ShoppingCart,
  ScanLine,
  Clock,
  Package,
  Settings,
  Home,
  Users,
  Calendar,
  FileText,
  Database,
  Globe,
  Mail,
  Bell,
  Building2,
  UtensilsCrossed,
  Receipt,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] || LayoutDashboard;
}
