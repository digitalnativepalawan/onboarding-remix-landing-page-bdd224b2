import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { PasskeyGate } from "./PasskeyGate";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useTheme } from "@/contexts/ThemeContext";

const titleMap: Record<string, string> = {
  "/": "Dashboard",
  "/admin": "Dashboard",
  "/admin/projects": "Projects",
  "/admin/clients": "Clients",
  "/admin/catalog": "Catalog",
  "/admin/products": "Products",
  "/admin/quotes": "Quotes",
  "/admin/tools": "Tools",
  "/admin/notes": "Notes",
  "/admin/media": "Media",
  "/admin/revenue": "Revenue",
  "/admin/site-settings": "Site Settings",
};

export default function AdminLayout() {
  const location = useLocation();
  const title = titleMap[location.pathname] || "Admin";
  const { settings } = useSiteSettings();
  const { theme } = useTheme();
  const logo = theme === "dark"
    ? (settings.logo_dark_url || settings.logo_light_url)
    : (settings.logo_light_url || settings.logo_dark_url);

  return (
    <PasskeyGate>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background text-foreground">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-12 flex items-center border-b border-border px-3 gap-3 sticky top-0 bg-background/95 backdrop-blur z-40">
              <SidebarTrigger />
              {logo && (
                <img src={logo} alt="Logo" className="h-6 w-auto object-contain" />
              )}
              <h1 className="text-sm font-semibold">{title}</h1>
            </header>
            <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </PasskeyGate>
  );
}
