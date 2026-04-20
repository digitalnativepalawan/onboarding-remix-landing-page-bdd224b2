import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Code, Heading2, Pin, PinOff, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

function Toolbar({ editor }: { editor: any }) {
  if (!editor) return null;
  const Btn = ({ onClick, active, children }: any) => (
    <button type="button" onClick={onClick} className={`h-9 w-9 inline-flex items-center justify-center rounded-md border border-border ${active ? "bg-accent text-accent-foreground" : "bg-background hover:bg-accent"}`}>{children}</button>
  );
  return (
    <div className="flex flex-wrap gap-1 mb-2">
      <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}><Bold className="h-4 w-4" /></Btn>
      <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><Italic className="h-4 w-4" /></Btn>
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}><Heading2 className="h-4 w-4" /></Btn>
      <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}><List className="h-4 w-4" /></Btn>
      <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}><ListOrdered className="h-4 w-4" /></Btn>
      <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}><Code className="h-4 w-4" /></Btn>
    </div>
  );
}

function NoteEditor({ note, projectId }: { note: any; projectId: string }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState(note.title);
  const timer = useRef<any>(null);
  const editor = useEditor({
    extensions: [StarterKit],
    content: note.content || "",
    editorProps: { attributes: { class: "prose prose-sm dark:prose-invert max-w-none min-h-[160px] p-3 rounded-md border border-border bg-background focus:outline-none" } },
    onUpdate: ({ editor }) => scheduleSave({ content: editor.getHTML() }),
  });

  const scheduleSave = (patch: any) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await supabase.from("notes").update(patch).eq("id", note.id);
      qc.invalidateQueries({ queryKey: ["project-notes", projectId] });
    }, 1000);
  };

  const togglePin = async () => {
    await supabase.from("notes").update({ pinned: !note.pinned }).eq("id", note.id);
    qc.invalidateQueries({ queryKey: ["project-notes", projectId] });
  };

  const remove = async () => {
    await supabase.from("notes").delete().eq("id", note.id);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["project-notes", projectId] });
  };

  const text = editor?.getText() || "";
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <Card className="p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Input value={title} onChange={(e) => { setTitle(e.target.value); scheduleSave({ title: e.target.value }); }} placeholder="Note title" className="font-semibold" />
        <Button size="icon" variant="ghost" className="h-9 w-9" onClick={togglePin} title={note.pinned ? "Unpin" : "Pin"}>
          {note.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
        </Button>
        <Button size="icon" variant="ghost" className="h-9 w-9 text-destructive" onClick={remove}><Trash2 className="h-4 w-4" /></Button>
      </div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <div className="text-xs text-muted-foreground flex justify-between">
        <span>{words} words · {text.length} chars</span>
        <span>Auto-saved</span>
      </div>
    </Card>
  );
}

export function NotesTab({ projectId }: { projectId: string }) {
  const qc = useQueryClient();
  const { data: notes = [] } = useQuery({
    queryKey: ["project-notes", projectId],
    queryFn: async () => {
      const { data } = await supabase.from("notes").select("*").eq("project_id", projectId).order("pinned", { ascending: false }).order("updated_at", { ascending: false });
      return data ?? [];
    },
  });

  const add = async () => {
    const { error } = await supabase.from("notes").insert({ project_id: projectId, title: "Untitled note", content: "", type: "idea" });
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["project-notes", projectId] });
  };

  return (
    <div className="space-y-3">
      <Button onClick={add} className="w-full sm:w-auto"><Plus className="h-4 w-4 mr-1" /> New note</Button>
      {notes.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">No notes yet. Create your first one above.</Card>
      ) : notes.map((n: any) => <NoteEditor key={n.id} note={n} projectId={projectId} />)}
    </div>
  );
}
