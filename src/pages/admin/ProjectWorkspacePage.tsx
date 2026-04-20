import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { WorkspaceHeader } from "@/components/admin/projects/workspace/WorkspaceHeader";
import { NotesTab } from "@/components/admin/projects/workspace/NotesTab";
import { LinksTab } from "@/components/admin/projects/workspace/LinksTab";
import { GalleryTab } from "@/components/admin/projects/workspace/GalleryTab";
import { CommentsTab } from "@/components/admin/projects/workspace/CommentsTab";
import { TimelineTab } from "@/components/admin/projects/workspace/TimelineTab";
import { FilesTab } from "@/components/admin/projects/workspace/FilesTab";

const TABS = [
  { value: "notes", label: "Notes" },
  { value: "links", label: "Links" },
  { value: "gallery", label: "Gallery" },
  { value: "comments", label: "Comments" },
  { value: "timeline", label: "Timeline" },
  { value: "files", label: "Files" },
];

export default function ProjectWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const [tab, setTab] = useState("notes");

  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id!).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (!id) return <Navigate to="/admin/projects" replace />;
  if (isLoading) return <p className="text-sm text-muted-foreground p-4">Loading workspace...</p>;
  if (error || !project) return <p className="text-sm text-destructive p-4">Project not found.</p>;

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <WorkspaceHeader project={project} />

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        {isMobile ? (
          <Select value={tab} onValueChange={setTab}>
            <SelectTrigger className="w-full h-11"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TABS.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
        ) : (
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1 w-full justify-start">
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="data-[state=active]:bg-background">{t.label}</TabsTrigger>
            ))}
          </TabsList>
        )}

        <div className="mt-4">
          <TabsContent value="notes" forceMount={tab === "notes" ? true : undefined} hidden={tab !== "notes"}>
            {tab === "notes" && <NotesTab projectId={id} />}
          </TabsContent>
          <TabsContent value="links" hidden={tab !== "links"}>{tab === "links" && <LinksTab projectId={id} />}</TabsContent>
          <TabsContent value="gallery" hidden={tab !== "gallery"}>{tab === "gallery" && <GalleryTab projectId={id} />}</TabsContent>
          <TabsContent value="comments" hidden={tab !== "comments"}>{tab === "comments" && <CommentsTab projectId={id} />}</TabsContent>
          <TabsContent value="timeline" hidden={tab !== "timeline"}>{tab === "timeline" && <TimelineTab projectId={id} />}</TabsContent>
          <TabsContent value="files" hidden={tab !== "files"}>{tab === "files" && <FilesTab projectId={id} />}</TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
