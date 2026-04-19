import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Package,
  FileText,
  Wrench,
  StickyNote,
  Image as ImageIcon,
  DollarSign,
  Settings2,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Projects", url: "/admin/projects", icon: FolderKanban },
  { title: "Clients", url: "/admin/clients", icon: Users },
  { title: "Catalog", url: "/admin/catalog", icon: Package },
  { title: "Quotes", url: "/admin/quotes", icon: FileText },
  { title: "Tools", url: "/admin/tools", icon: Wrench },
  { title: "Notes", url: "/admin/notes", icon: StickyNote },
  { title: "Media", url: "/admin/media", icon: ImageIcon },
  { title: "Revenue", url: "/admin/revenue", icon: DollarSign },
  { title: "Site Settings", url: "/admin/site-settings", icon: Settings2 },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Command Center</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className="flex items-center gap-2 hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
