import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Check, Trash2, Pencil, Send } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export function CommentsTab({ projectId }: { projectId: string }) {
  const qc = useQueryClient();
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const { data: comments = [] } = useQuery({
    queryKey: ["project-comments", projectId],
    queryFn: async () => {
      const { data } = await supabase.from("project_comments").select("*").eq("project_id", projectId).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["project-comments", projectId] });

  const add = async () => {
    if (!content.trim()) return;
    const { error } = await supabase.from("project_comments").insert({ project_id: projectId, content, author: "admin" });
    if (error) return toast.error(error.message);
    setContent("");
    refresh();
  };

  const toggleResolve = async (c: any) => {
    await supabase.from("project_comments").update({ resolved: !c.resolved }).eq("id", c.id);
    refresh();
  };

  const remove = async (id: string) => {
    await supabase.from("project_comments").delete().eq("id", id);
    refresh();
  };

  const saveEdit = async (id: string) => {
    await supabase.from("project_comments").update({ content: editText }).eq("id", id);
    setEditingId(null);
    refresh();
  };

  return (
    <div className="space-y-4">
      <Card className="p-3 space-y-2">
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write a comment..." rows={3} />
        <Button onClick={add} disabled={!content.trim()} className="w-full sm:w-auto"><Send className="h-4 w-4 mr-1" /> Post</Button>
      </Card>

      {comments.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">No comments yet.</Card>
      ) : comments.map((c: any) => (
        <Card key={c.id} className={`p-3 space-y-2 ${c.resolved ? "opacity-60" : ""}`}>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{c.author}</Badge>
              <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</span>
              {c.resolved && <Badge variant="secondary">Resolved</Badge>}
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toggleResolve(c)}><Check className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditingId(c.id); setEditText(c.content); }}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
          {editingId === c.id ? (
            <div className="space-y-2">
              <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={3} />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => saveEdit(c.id)}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{c.content}</p>
          )}
        </Card>
      ))}
    </div>
  );
}
