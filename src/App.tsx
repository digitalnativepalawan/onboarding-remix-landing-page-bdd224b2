import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Setup from "./pages/Setup";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";
import AdminLayout from "./components/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import ProjectsPage from "./pages/admin/ProjectsPage";
import ProjectWorkspacePage from "./pages/admin/ProjectWorkspacePage";
import ClientsPage from "./pages/admin/ClientsPage";
import CatalogPage from "./pages/admin/CatalogPage";
import QuotesPage from "./pages/admin/QuotesPage";
import ToolsPage from "./pages/admin/ToolsPage";
import NotesPage from "./pages/admin/NotesPage";
import MediaPage from "./pages/admin/MediaPage";
import RevenuePage from "./pages/admin/RevenuePage";
import ExpensesPage from "./pages/admin/ExpensesPage";
import SiteSettingsPage from "./pages/admin/SiteSettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LocaleProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/setup" element={<Setup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin/legacy" element={<AdminPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="projects/:id" element={<ProjectWorkspacePage />} />
                <Route path="clients" element={<ClientsPage />} />
                <Route path="catalog" element={<CatalogPage />} />
                <Route path="quotes" element={<QuotesPage />} />
                <Route path="tools" element={<ToolsPage />} />
                <Route path="notes" element={<NotesPage />} />
                <Route path="media" element={<MediaPage />} />
                <Route path="revenue" element={<RevenuePage />} />
                <Route path="expenses" element={<ExpensesPage />} />
                <Route path="site-settings" element={<SiteSettingsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LocaleProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
