import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  LayoutDashboard, FolderKanban, Users, FileText, Package,
  Wrench, ArrowLeft, Plus, Pencil, Trash2, Check, X,
  ExternalLink, Github, Globe, Database, Code2, Link2,
  MessageCircle, Calendar, Tag, ChevronDown, ChevronUp,
  StickyNote, Bug, Flag, CheckSquare, Eye, EyeOff, Lock, LayoutGrid, Globe2,
  type LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AdminSettingsModal from "@/components/landing/AdminSettingsModal";

const ADMIN_PASSKEY = "5309";

/* ── TYPES ─────────────────────────────────────────────────── */
interface Project {
  id: string; name: string; description: string; status: string;
  client_name: string; webapp_type: string; github_url: string;
  vercel_url: string; lovable_url: string; supabase_project_id: string;
  live_url: string; display_order: number; created_at: string;
}
interface ProjectUrl {
  id: string; project_id: string; label: string; url: string; url_type: string; created_at: string;
}
interface ProjectNote {
  id: string; project_id: string; content: string; note_type: string; created_at: string;
}
interface Client {
  id: string; name: string; business_name: string; business_type: string;
  whatsapp: string; email: string; location: string; status: string; notes: string; created_at: string;
}
interface Quote {
  id: string; client_id: string; client_name: string; webapp_type: string;
  description: string; price_php: number; status: string; valid_until: string; notes: string; created_at: string;
}
interface CatalogItem {
  id: string; name: string; description: string; features: string;
  price_from_php: number; turnaround_days: number; status: string; display_order: number;
}
interface QuoteFormData {
  client_name: string; webapp_type: string; description: string;
  price_php: number; status: string; valid_until: string; notes: string;
}
interface CatalogFormData {
  name: string; description: string; features: string;
  price_from_php: number; turnaround_days: number; status: string;
}

/* ── STATUS BADGES ─────────────────────────────────────────── */
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  live:       { bg: "#052e16", color: "#4ade80" },
  building:   { bg: "#1c1a00", color: "#facc15" },
  planned:    { bg: "#0c1e36", color: "#60a5fa" },
  paused:     { bg: "#1c0a00", color: "#f97316" },
  prospect:   { bg: "#0c1e36", color: "#60a5fa" },
  active:     { bg: "#052e16", color: "#4ade80" },
  done:       { bg: "#1a1200", color: "#a3a3a3" },
  draft:      { bg: "#1a1a1a", color: "#a3a3a3" },
  sent:       { bg: "#0c1e36", color: "#60a5fa" },
  accepted:   { bg: "#052e16", color: "#4ade80" },
  declined:   { bg: "#1a0000", color: "#f87171" },
  invoiced:   { bg: "#1a1200", color: "#c9a84c" },
  available:  { bg: "#052e16", color: "#4ade80" },
  coming_soon:{ bg: "#1c1a00", color: "#facc15" },
  retired:    { bg: "#1a1a1a", color: "#a3a3a3" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = STATUS_COLORS[status] || { bg: "#1a1a1a", color: "#a3a3a3" };
  return (
    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full capitalize"
      style={{ background: s.bg, color: s.color }}>
      {status.replace("_", " ")}
    </span>
  );
};

const NOTE_ICONS: Record<string, LucideIcon> = {
  note: StickyNote, comment: MessageCircle, todo: CheckSquare, bug: Bug, milestone: Flag,
};
const NOTE_COLORS: Record<string, string> = {
  note: "#60a5fa", comment: "#a3a3a3", todo: "#facc15", bug: "#f87171", milestone: "#4ade80",
};

const URL_ICONS: Record<string, LucideIcon> = {
  github: Github, vercel: Globe, supabase: Database, lovable: Code2, live: Globe, other: Link2,
};

/* ── TOOL LINKS ─────────────────────────────────────────────── */
const TOOLS = [
  { name: "Claude AI", url: "https://claude.ai", icon: "🤖", desc: "AI assistant & code generation" },
  { name: "Lovable.dev", url: "https://lovable.dev", icon: "❤️", desc: "Vibe coding & UI generation" },
  { name: "GitHub", url: "https://github.com/digitalnativepalawan", icon: "🐙", desc: "digitalnativepalawan repos" },
  { name: "Vercel", url: "https://vercel.com/dashboard", icon: "▲", desc: "Deployments & domains" },
  { name: "Supabase", url: "https://supabase.com/dashboard", icon: "⚡", desc: "Database & auth" },
  { name: "Deepseek", url: "https://chat.deepseek.com", icon: "🔍", desc: "AI reasoning & coding" },
  { name: "Collectivepalawan OSS", url: "https://github.com/collectivepalawan-oss", icon: "🌴", desc: "Org repos" },
  { name: "Netlify", url: "https://app.netlify.com", icon: "🟢", desc: "Backup deployments" },
  { name: "OpenRouter", url: "https://openrouter.ai", icon: "🔀", desc: "AI model routing" },
  { name: "Palawan Collective", url: "https://euro.palawancollective.com", icon: "🏝️", desc: "Main landing page" },
];

/* ══════════════════════════════════════════════════════════════
   SECTION COMPONENTS
══════════════════════════════════════════════════════════════ */

/* ── DASHBOARD ─────────────────────────────────────────────── */
const DashboardSection = ({ projects, clients, quotes }: { projects: Project[]; clients: Client[]; quotes: Quote[] }) => {
  const live = projects.filter(p => p.status === "live").length;
  const building = projects.filter(p => p.status === "building").length;
  const activeClients = clients.filter(c => c.status === "active").length;
  const pendingQuotes = quotes.filter(q => q.status === "sent").length;
  const revenue = quotes.filter(q => q.status === "accepted").reduce((sum, q) => sum + (q.price_php || 0), 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Live webapps", val: live, color: "#4ade80" },
          { label: "In development", val: building, color: "#facc15" },
          { label: "Active clients", val: activeClients, color: "#60a5fa" },
          { label: "Pending quotes", val: pendingQuotes, color: "#f97316" },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xs mb-1" style={{ color: "#6b7280" }}>{s.label}</p>
            <p className="text-3xl font-bold font-mono" style={{ color: s.color }}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Revenue */}
      <div className="rounded-xl p-4" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-xs mb-1" style={{ color: "#6b7280" }}>Total accepted quote value</p>
        <p className="text-2xl font-bold font-mono" style={{ color: "#c9a84c" }}>
          ₱{revenue.toLocaleString()}
        </p>
      </div>

      {/* Active projects quick view */}
      <div>
        <p className="text-xs font-medium mb-3" style={{ color: "#6b7280" }}>ACTIVE PROJECTS</p>
        <div className="space-y-2">
          {projects.filter(p => p.status === "live" || p.status === "building").map(p => (
            <div key={p.id} className="flex items-center justify-between rounded-lg px-3 py-2.5"
              style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2.5">
                <StatusBadge status={p.status} />
                <span className="text-sm text-white font-medium">{p.name}</span>
                <span className="text-xs" style={{ color: "#6b7280" }}>{p.webapp_type}</span>
              </div>
              {p.live_url && (
                <a href={p.live_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5" style={{ color: "#4b5563" }} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick tool links */}
      <div>
        <p className="text-xs font-medium mb-3" style={{ color: "#6b7280" }}>QUICK ACCESS</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TOOLS.slice(0, 6).map(t => (
            <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 hover:opacity-80 transition-opacity"
              style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-sm">{t.icon}</span>
              <span className="text-xs text-white truncate">{t.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── PROJECTS ──────────────────────────────────────────────── */
const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [urls, setUrls] = useState<Record<string, ProjectUrl[]>>({});
  const [notes, setNotes] = useState<Record<string, ProjectNote[]>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [addingUrl, setAddingUrl] = useState<string | null>(null);
  const [addingNote, setAddingNote] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState({ label: "", url: "", url_type: "other" });
  const [newNote, setNewNote] = useState({ content: "", note_type: "note" });
  const emptyProject = { name: "", description: "", status: "building", client_name: "", webapp_type: "", github_url: "", vercel_url: "", lovable_url: "", supabase_project_id: "", live_url: "" };
  const [form, setForm] = useState(emptyProject);

  const fetch = async () => {
    const { data } = await supabase.from("admin_projects").select("*").order("display_order");
    setProjects(data || []);
  };

  const fetchProjectData = async (pid: string) => {
    const [{ data: u }, { data: n }] = await Promise.all([
      supabase.from("admin_project_urls").select("*").eq("project_id", pid).order("created_at"),
      supabase.from("admin_project_notes").select("*").eq("project_id", pid).order("created_at", { ascending: false }),
    ]);
    setUrls(prev => ({ ...prev, [pid]: u || [] }));
    setNotes(prev => ({ ...prev, [pid]: n || [] }));
  };

  useEffect(() => { fetch(); }, []);

  const toggleExpand = (id: string) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    fetchProjectData(id);
  };

  const handleSave = async () => {
    if (!form.name) { toast.error("Name required"); return; }
    setLoading(true);
    if (editing) {
      await supabase.from("admin_projects").update({ ...form, updated_at: new Date().toISOString() }).eq("id", editing);
      toast.success("Project updated");
      setEditing(null);
    } else {
      const maxOrder = projects.length > 0 ? Math.max(...projects.map(p => p.display_order)) : 0;
      await supabase.from("admin_projects").insert({ ...form, display_order: maxOrder + 1 });
      toast.success("Project added");
      setAdding(false);
    }
    setForm(emptyProject);
    fetch();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    await supabase.from("admin_projects").delete().eq("id", id);
    toast.success("Project deleted");
    fetch();
    setLoading(false);
  };

  const handleAddUrl = async (pid: string) => {
    if (!newUrl.label || !newUrl.url) { toast.error("Label and URL required"); return; }
    await supabase.from("admin_project_urls").insert({ ...newUrl, project_id: pid });
    toast.success("URL added");
    setAddingUrl(null);
    setNewUrl({ label: "", url: "", url_type: "other" });
    fetchProjectData(pid);
  };

  const handleDeleteUrl = async (id: string, pid: string) => {
    await supabase.from("admin_project_urls").delete().eq("id", id);
    fetchProjectData(pid);
  };

  const handleAddNote = async (pid: string) => {
    if (!newNote.content) { toast.error("Note content required"); return; }
    await supabase.from("admin_project_notes").insert({ ...newNote, project_id: pid });
    toast.success("Note added");
    setAddingNote(null);
    setNewNote({ content: "", note_type: "note" });
    fetchProjectData(pid);
  };

  const handleDeleteNote = async (id: string, pid: string) => {
    await supabase.from("admin_project_notes").delete().eq("id", id);
    fetchProjectData(pid);
  };

  const ProjectForm = () => (
    <div className="space-y-3 p-4 rounded-xl" style={{ background: "#111827", border: "1px solid rgba(99,102,241,0.3)" }}>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs text-gray-400 mb-1 block">Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Project name" /></div>
        <div><Label className="text-xs text-gray-400 mb-1 block">Status</Label>
          <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {["building", "live", "planned", "paused"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs text-gray-400 mb-1 block">Webapp type</Label><Input value={form.webapp_type} onChange={e => setForm({ ...form, webapp_type: e.target.value })} placeholder="Resort ops, Transport..." /></div>
        <div><Label className="text-xs text-gray-400 mb-1 block">Client name</Label><Input value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} placeholder="Client or business" /></div>
      </div>
      <div><Label className="text-xs text-gray-400 mb-1 block">Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="What this project does" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs text-gray-400 mb-1 block">Live URL</Label><Input value={form.live_url} onChange={e => setForm({ ...form, live_url: e.target.value })} placeholder="https://..." /></div>
        <div><Label className="text-xs text-gray-400 mb-1 block">GitHub URL</Label><Input value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/..." /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs text-gray-400 mb-1 block">Vercel URL</Label><Input value={form.vercel_url} onChange={e => setForm({ ...form, vercel_url: e.target.value })} placeholder="https://vercel.com/..." /></div>
        <div><Label className="text-xs text-gray-400 mb-1 block">Supabase Project ID</Label><Input value={form.supabase_project_id} onChange={e => setForm({ ...form, supabase_project_id: e.target.value })} placeholder="project-id" /></div>
      </div>
      <div><Label className="text-xs text-gray-400 mb-1 block">Lovable URL</Label><Input value={form.lovable_url} onChange={e => setForm({ ...form, lovable_url: e.target.value })} placeholder="https://lovable.dev/..." /></div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} disabled={loading}><Check className="w-3 h-3 mr-1" />{editing ? "Save" : "Add Project"}</Button>
        <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setEditing(null); setForm(emptyProject); }}><X className="w-3 h-3 mr-1" />Cancel</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      {projects.map(p => (
        <div key={p.id} className="rounded-xl overflow-hidden" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
          {editing === p.id ? (
            <div className="p-4"><ProjectForm /></div>
          ) : (
            <>
              {/* Project header */}
              <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => toggleExpand(p.id)}>
                <div className="flex items-center gap-3 min-w-0">
                  <StatusBadge status={p.status} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{p.name}</p>
                    <p className="text-xs" style={{ color: "#6b7280" }}>{p.webapp_type}{p.client_name ? ` · ${p.client_name}` : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="p-1.5 rounded hover:bg-white/5"><ExternalLink className="w-3.5 h-3.5" style={{ color: "#4b5563" }} /></a>}
                  <button onClick={e => { e.stopPropagation(); setEditing(p.id); setForm({ name: p.name, description: p.description || "", status: p.status, client_name: p.client_name || "", webapp_type: p.webapp_type || "", github_url: p.github_url || "", vercel_url: p.vercel_url || "", lovable_url: p.lovable_url || "", supabase_project_id: p.supabase_project_id || "", live_url: p.live_url || "" }); }} className="p-1.5 rounded hover:bg-white/5"><Pencil className="w-3.5 h-3.5" style={{ color: "#4b5563" }} /></button>
                  <button onClick={e => { e.stopPropagation(); handleDelete(p.id); }} className="p-1.5 rounded hover:bg-white/5"><Trash2 className="w-3.5 h-3.5 text-red-500/60" /></button>
                  {expanded === p.id ? <ChevronUp className="w-4 h-4 ml-1" style={{ color: "#4b5563" }} /> : <ChevronDown className="w-4 h-4 ml-1" style={{ color: "#4b5563" }} />}
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === p.id && (
                <div className="border-t px-4 py-4 space-y-5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  {p.description && <p className="text-sm" style={{ color: "#9ca3af" }}>{p.description}</p>}

                  {/* Quick links row */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "GitHub", url: p.github_url, icon: Github, color: "#e2e8f0" },
                      { label: "Vercel", url: p.vercel_url, icon: Globe, color: "#e2e8f0" },
                      { label: "Supabase", url: p.supabase_project_id ? `https://supabase.com/dashboard/project/${p.supabase_project_id}` : "", icon: Database, color: "#3ecf8e" },
                      { label: "Lovable", url: p.lovable_url, icon: Code2, color: "#f97316" },
                      { label: "Live site", url: p.live_url, icon: ExternalLink, color: "#4ade80" },
                    ].filter(l => l.url).map(l => (
                      <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs hover:opacity-80 transition-opacity"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: l.color }}>
                        <l.icon className="w-3 h-3" />{l.label}
                      </a>
                    ))}
                  </div>

                  {/* Extra URLs */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium" style={{ color: "#6b7280" }}>ADDITIONAL URLS</p>
                      <button onClick={() => setAddingUrl(addingUrl === p.id ? null : p.id)} className="text-xs flex items-center gap-1" style={{ color: "#60a5fa" }}>
                        <Plus className="w-3 h-3" />Add URL
                      </button>
                    </div>
                    {addingUrl === p.id && (
                      <div className="flex gap-2 mb-2 flex-wrap">
                        <Input className="flex-1 min-w-[100px]" placeholder="Label" value={newUrl.label} onChange={e => setNewUrl({ ...newUrl, label: e.target.value })} />
                        <Input className="flex-1 min-w-[140px]" placeholder="https://..." value={newUrl.url} onChange={e => setNewUrl({ ...newUrl, url: e.target.value })} />
                        <select className="h-10 rounded-md border border-input bg-background px-2 text-sm" value={newUrl.url_type} onChange={e => setNewUrl({ ...newUrl, url_type: e.target.value })}>
                          {["github", "vercel", "supabase", "lovable", "live", "other"].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <Button size="sm" onClick={() => handleAddUrl(p.id)}><Check className="w-3 h-3" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => setAddingUrl(null)}><X className="w-3 h-3" /></Button>
                      </div>
                    )}
                    {(urls[p.id] || []).map(u => {
                      const Icon = URL_ICONS[u.url_type] || Link2;
                      return (
                        <div key={u.id} className="flex items-center gap-2 py-1">
                          <Icon className="w-3 h-3 shrink-0" style={{ color: "#6b7280" }} />
                          <a href={u.url} target="_blank" rel="noopener noreferrer" className="text-xs flex-1 truncate hover:underline" style={{ color: "#60a5fa" }}>{u.label} — {u.url}</a>
                          <button onClick={() => handleDeleteUrl(u.id, p.id)}><Trash2 className="w-3 h-3 text-red-500/40 hover:text-red-500" /></button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Notes */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium" style={{ color: "#6b7280" }}>NOTES & COMMENTS</p>
                      <button onClick={() => setAddingNote(addingNote === p.id ? null : p.id)} className="text-xs flex items-center gap-1" style={{ color: "#60a5fa" }}>
                        <Plus className="w-3 h-3" />Add note
                      </button>
                    </div>
                    {addingNote === p.id && (
                      <div className="space-y-2 mb-3 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="flex gap-2">
                          <select className="h-9 rounded-md border border-input bg-background px-2 text-sm" value={newNote.note_type} onChange={e => setNewNote({ ...newNote, note_type: e.target.value })}>
                            {["note", "comment", "todo", "bug", "milestone"].map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <Button size="sm" onClick={() => handleAddNote(p.id)}><Check className="w-3 h-3 mr-1" />Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setAddingNote(null)}><X className="w-3 h-3" /></Button>
                        </div>
                        <Textarea placeholder="Write your note here..." value={newNote.content} onChange={e => setNewNote({ ...newNote, content: e.target.value })} rows={3} />
                      </div>
                    )}
                    <div className="space-y-2">
                      {(notes[p.id] || []).map(n => {
                        const Icon = NOTE_ICONS[n.note_type] || StickyNote;
                        const color = NOTE_COLORS[n.note_type] || "#a3a3a3";
                        return (
                          <div key={n.id} className="flex gap-2.5 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs whitespace-pre-wrap" style={{ color: "#d1d5db" }}>{n.content}</p>
                              <p className="text-[10px] mt-1" style={{ color: "#4b5563" }}>
                                {n.note_type} · {new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                            <button onClick={() => handleDeleteNote(n.id, p.id)} className="shrink-0"><Trash2 className="w-3 h-3 text-red-500/30 hover:text-red-500" /></button>
                          </div>
                        );
                      })}
                      {(notes[p.id] || []).length === 0 && <p className="text-xs" style={{ color: "#4b5563" }}>No notes yet.</p>}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ))}

      {adding ? (
        <ProjectForm />
      ) : (
        <Button variant="outline" className="w-full" onClick={() => { setAdding(true); setEditing(null); setForm(emptyProject); }}>
          <Plus className="w-4 h-4 mr-2" />Add Project
        </Button>
      )}
    </div>
  );
};

/* ── CLIENTS ───────────────────────────────────────────────── */
const ClientsSection = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const empty = { name: "", business_name: "", business_type: "", whatsapp: "", email: "", location: "", status: "prospect", notes: "" };
  const [form, setForm] = useState(empty);

  const fetch = async () => { const { data } = await supabase.from("admin_clients").select("*").order("created_at", { ascending: false }); setClients(data || []); };
  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    if (!form.name) { toast.error("Name required"); return; }
    setLoading(true);
    if (editing) { await supabase.from("admin_clients").update(form).eq("id", editing); toast.success("Client updated"); setEditing(null); }
    else { await supabase.from("admin_clients").insert(form); toast.success("Client added"); setAdding(false); }
    setForm(empty); fetch(); setLoading(false);
  };

  const ClientForm = () => (
    <div className="space-y-3 p-4 rounded-xl" style={{ background: "#111827", border: "1px solid rgba(99,102,241,0.3)" }}>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs text-gray-400 mb-1 block">Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Contact name" /></div>
        <div><Label className="text-xs text-gray-400 mb-1 block">Business name</Label><Input value={form.business_name} onChange={e => setForm({ ...form, business_name: e.target.value })} placeholder="Business or resort name" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs text-gray-400 mb-1 block">Business type</Label><Input value={form.business_type} onChange={e => setForm({ ...form, business_type: e.target.value })} placeholder="Resort, Restaurant..." /></div>
        <div><Label className="text-xs text-gray-400 mb-1 block">Status</Label>
          <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {["prospect", "active", "done", "paused"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs text-gray-400 mb-1 block">WhatsApp</Label><Input value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} placeholder="+63 9xx xxx xxxx" /></div>
        <div><Label className="text-xs text-gray-400 mb-1 block">Email</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@..." /></div>
      </div>
      <div><Label className="text-xs text-gray-400 mb-1 block">Location</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="El Nido, Port Barton..." /></div>
      <div><Label className="text-xs text-gray-400 mb-1 block">Notes</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Any notes about this client" /></div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} disabled={loading}><Check className="w-3 h-3 mr-1" />{editing ? "Save" : "Add Client"}</Button>
        <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setEditing(null); setForm(empty); }}><X className="w-3 h-3 mr-1" />Cancel</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      {clients.map(c => (
        <div key={c.id} className="rounded-xl overflow-hidden" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
          {editing === c.id ? <div className="p-4"><ClientForm /></div> : (
            <div className="flex items-start justify-between px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={c.status} />
                  <p className="text-sm font-medium text-white">{c.name}</p>
                </div>
                {c.business_name && <p className="text-xs font-medium" style={{ color: "#9ca3af" }}>{c.business_name} · {c.business_type}</p>}
                {c.location && <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{c.location}</p>}
                {c.whatsapp && (
                  <a href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs mt-1 hover:opacity-80" style={{ color: "#4ade80" }}>
                    <MessageCircle className="w-3 h-3" />{c.whatsapp}
                  </a>
                )}
                {c.notes && <p className="text-xs mt-1.5 italic" style={{ color: "#6b7280" }}>{c.notes}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => { setEditing(c.id); setForm({ name: c.name, business_name: c.business_name || "", business_type: c.business_type || "", whatsapp: c.whatsapp || "", email: c.email || "", location: c.location || "", status: c.status, notes: c.notes || "" }); }} className="p-1.5 rounded hover:bg-white/5"><Pencil className="w-3.5 h-3.5" style={{ color: "#4b5563" }} /></button>
                <button onClick={async () => { await supabase.from("admin_clients").delete().eq("id", c.id); fetch(); }} className="p-1.5 rounded hover:bg-white/5"><Trash2 className="w-3.5 h-3.5 text-red-500/60" /></button>
              </div>
            </div>
          )}
        </div>
      ))}
      {adding ? <ClientForm /> : (
        <Button variant="outline" className="w-full" onClick={() => { setAdding(true); setEditing(null); setForm(empty); }}>
          <Plus className="w-4 h-4 mr-2" />Add Client
        </Button>
      )}
    </div>
  );
};

/* ── QUOTES ────────────────────────────────────────────────── */
const QuotesSection = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const empty: QuoteFormData = { client_name: "", webapp_type: "", description: "", price_php: 0, status: "draft", valid_until: "", notes: "" };
  const [form, setForm] = useState<QuoteFormData>(empty);

  const fetch = async () => { const { data } = await supabase.from("admin_quotes").select("*").order("created_at", { ascending: false }); setQuotes(data || []); };
  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    if (!form.client_name || !form.webapp_type) { toast.error("Client and webapp type required"); return; }
    setLoading(true);
    if (editing) { await supabase.from("admin_quotes").update(form).eq("id", editing); toast.success("Quote updated"); setEditing(null); }
    else { await supabase.from("admin_quotes").insert(form); toast.success("Quote added"); setAdding(false); }
    setForm(empty); fetch(); setLoading(false);
  };

  const QuoteForm = () => (
    <div className="space-y-3 p-4 rounded-xl" style={{ background: "#111827", border: "1px solid rgba(99,102,241,0.3)" }}>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs text-gray-400 mb-1 block">Client name *</Label><Input value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} placeholder="Client or business" /></div>
        <div><Label className="text-xs text-gray-400 mb-1 block">WebApp type *</Label><Input value={form.webapp_type} onChange={e => setForm({ ...form, webapp_type: e.target.value })} placeholder="Resort ops, Ordering..." /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs text-gray-400 mb-1 block">Price (PHP)</Label><Input type="number" value={form.price_php} onChange={e => setForm({ ...form, price_php: Number(e.target.value) })} placeholder="0" /></div>
        <div><Label className="text-xs text-gray-400 mb-1 block">Status</Label>
          <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {["draft", "sent", "accepted", "declined", "invoiced"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs text-gray-400 mb-1 block">Valid until</Label><Input type="date" value={form.valid_until} onChange={e => setForm({ ...form, valid_until: e.target.value })} /></div>
      </div>
      <div><Label className="text-xs text-gray-400 mb-1 block">Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="What's included in this quote" /></div>
      <div><Label className="text-xs text-gray-400 mb-1 block">Notes</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Internal notes" /></div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} disabled={loading}><Check className="w-3 h-3 mr-1" />{editing ? "Save" : "Add Quote"}</Button>
        <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setEditing(null); setForm(empty); }}><X className="w-3 h-3 mr-1" />Cancel</Button>
      </div>
    </div>
  );

  const total = quotes.filter(q => q.status === "accepted").reduce((s, q) => s + (q.price_php || 0), 0);

  return (
    <div className="space-y-3">
      {total > 0 && (
        <div className="rounded-xl px-4 py-3 flex items-center justify-between" style={{ background: "#111827", border: "1px solid rgba(201,168,76,0.2)" }}>
          <span className="text-xs" style={{ color: "#6b7280" }}>Total accepted</span>
          <span className="text-lg font-bold font-mono" style={{ color: "#c9a84c" }}>₱{total.toLocaleString()}</span>
        </div>
      )}
      {quotes.map(q => (
        <div key={q.id} className="rounded-xl overflow-hidden" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
          {editing === q.id ? <div className="p-4"><QuoteForm /></div> : (
            <div className="flex items-start justify-between px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <StatusBadge status={q.status} />
                  <p className="text-sm font-medium text-white">{q.client_name}</p>
                  <p className="text-xs" style={{ color: "#6b7280" }}>{q.webapp_type}</p>
                </div>
                <p className="text-base font-bold font-mono" style={{ color: "#c9a84c" }}>₱{(q.price_php || 0).toLocaleString()}</p>
                {q.description && <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>{q.description}</p>}
                {q.valid_until && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#6b7280" }}><Calendar className="w-3 h-3" />Valid until {q.valid_until}</p>}
                {q.notes && <p className="text-xs mt-1 italic" style={{ color: "#6b7280" }}>{q.notes}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => { setEditing(q.id); setForm({ client_name: q.client_name, webapp_type: q.webapp_type, description: q.description || "", price_php: q.price_php, status: q.status, valid_until: q.valid_until || "", notes: q.notes || "" }); }} className="p-1.5 rounded hover:bg-white/5"><Pencil className="w-3.5 h-3.5" style={{ color: "#4b5563" }} /></button>
                <button onClick={async () => { await supabase.from("admin_quotes").delete().eq("id", q.id); fetch(); }} className="p-1.5 rounded hover:bg-white/5"><Trash2 className="w-3.5 h-3.5 text-red-500/60" /></button>
              </div>
            </div>
          )}
        </div>
      ))}
      {adding ? <QuoteForm /> : (
        <Button variant="outline" className="w-full" onClick={() => { setAdding(true); setEditing(null); setForm(empty); }}>
          <Plus className="w-4 h-4 mr-2" />Add Quote
        </Button>
      )}
    </div>
  );
};

/* ── CATALOG ───────────────────────────────────────────────── */
const CatalogSection = () => {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const empty: CatalogFormData = { name: "", description: "", features: "", price_from_php: 0, turnaround_days: 14, status: "available" };
  const [form, setForm] = useState<CatalogFormData>(empty);

  const fetch = async () => { const { data } = await supabase.from("admin_catalog").select("*").order("display_order"); setItems(data || []); };
  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    if (!form.name) { toast.error("Name required"); return; }
    setLoading(true);
    if (editing) { await supabase.from("admin_catalog").update(form).eq("id", editing); toast.success("Updated"); setEditing(null); }
    else { const max = items.length > 0 ? Math.max(...items.map(i => i.display_order)) : 0; await supabase.from("admin_catalog").insert({ ...form, display_order: max + 1 }); toast.success("Added"); setAdding(false); }
    setForm(empty); fetch(); setLoading(false);
  };

  const CatalogForm = () => (
    <div className="space-y-3 p-4 rounded-xl" style={{ background: "#111827", border: "1px solid rgba(99,102,241,0.3)" }}>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs text-gray-400 mb-1 block">Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Product name" /></div>
        <div><Label className="text-xs text-gray-400 mb-1 block">Status</Label>
          <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {["available", "coming_soon", "retired"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div><Label className="text-xs text-gray-400 mb-1 block">Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} /></div>
      <div><Label className="text-xs text-gray-400 mb-1 block">Features (comma separated)</Label><Textarea value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} rows={2} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs text-gray-400 mb-1 block">Price from (PHP)</Label><Input type="number" value={form.price_from_php} onChange={e => setForm({ ...form, price_from_php: Number(e.target.value) })} /></div>
        <div><Label className="text-xs text-gray-400 mb-1 block">Turnaround (days)</Label><Input type="number" value={form.turnaround_days} onChange={e => setForm({ ...form, turnaround_days: Number(e.target.value) })} /></div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} disabled={loading}><Check className="w-3 h-3 mr-1" />{editing ? "Save" : "Add Item"}</Button>
        <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setEditing(null); setForm(empty); }}><X className="w-3 h-3 mr-1" />Cancel</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.id} className="rounded-xl overflow-hidden" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
          {editing === item.id ? <div className="p-4"><CatalogForm /></div> : (
            <div className="flex items-start justify-between px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={item.status} />
                  <p className="text-sm font-medium text-white">{item.name}</p>
                </div>
                {item.description && <p className="text-xs mb-1" style={{ color: "#9ca3af" }}>{item.description}</p>}
                {item.features && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {item.features.split(",").map(f => (
                      <span key={f} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#6b7280" }}>{f.trim()}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-bold font-mono" style={{ color: "#c9a84c" }}>from ₱{(item.price_from_php || 0).toLocaleString()}</span>
                  <span className="text-xs" style={{ color: "#6b7280" }}>{item.turnaround_days} days</span>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => { setEditing(item.id); setForm({ name: item.name, description: item.description || "", features: item.features || "", price_from_php: item.price_from_php, turnaround_days: item.turnaround_days, status: item.status }); }} className="p-1.5 rounded hover:bg-white/5"><Pencil className="w-3.5 h-3.5" style={{ color: "#4b5563" }} /></button>
                <button onClick={async () => { await supabase.from("admin_catalog").delete().eq("id", item.id); fetch(); }} className="p-1.5 rounded hover:bg-white/5"><Trash2 className="w-3.5 h-3.5 text-red-500/60" /></button>
              </div>
            </div>
          )}
        </div>
      ))}
      {adding ? <CatalogForm /> : (
        <Button variant="outline" className="w-full" onClick={() => { setAdding(true); setEditing(null); setForm(empty); }}>
          <Plus className="w-4 h-4 mr-2" />Add Product
        </Button>
      )}
    </div>
  );
};

/* ── WEBAPPS ────────────────────────────────────────────────── */
interface AppLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  display_order: number;
  is_primary: boolean;
  is_visible: boolean;
}

const WebAppsSection = () => {
  const [apps, setApps] = useState<AppLink[]>([]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const empty = { name: "", url: "", icon: "LayoutDashboard", display_order: 0, is_primary: false, is_visible: true };
  const [form, setForm] = useState(empty);

  const fetchApps = async () => {
    const { data } = await supabase.from("app_links").select("*").order("display_order");
    setApps(data || []);
  };

  useEffect(() => { fetchApps(); }, []);

  const handleToggleVisible = async (app: AppLink) => {
    const { error } = await supabase.from("app_links").update({ is_visible: !app.is_visible, updated_at: new Date().toISOString() }).eq("id", app.id);
    if (error) { toast.error("Failed to update visibility"); return; }
    toast.success(app.is_visible ? "Hidden from site" : "Visible on site");
    fetchApps();
  };

  const handleSave = async () => {
    if (!form.name || !form.url) { toast.error("Name and URL required"); return; }
    setLoading(true);
    if (editing) {
      const { error } = await supabase.from("app_links").update({ ...form, updated_at: new Date().toISOString() }).eq("id", editing);
      if (error) { toast.error("Failed to update WebApp"); setLoading(false); return; }
      toast.success("WebApp updated");
      setEditing(null);
    } else {
      const maxOrder = apps.reduce((max, a) => Math.max(max, a.display_order), 0);
      const { error } = await supabase.from("app_links").insert({ ...form, display_order: maxOrder + 1 });
      if (error) { toast.error("Failed to add WebApp"); setLoading(false); return; }
      toast.success("WebApp added");
      setAdding(false);
    }
    setForm(empty);
    fetchApps();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from("app_links").delete().eq("id", id);
    if (error) { toast.error("Failed to remove WebApp"); setLoading(false); return; }
    toast.success("WebApp removed");
    fetchApps();
    setLoading(false);
  };

  const AppForm = () => (
    <div className="space-y-3 p-4 rounded-xl" style={{ background: "#111827", border: "1px solid rgba(99,102,241,0.3)" }}>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs text-gray-400 mb-1 block">Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="App name" /></div>
        <div><Label className="text-xs text-gray-400 mb-1 block">Display order</Label><Input type="number" value={form.display_order} onChange={e => setForm({ ...form, display_order: Number(e.target.value) })} /></div>
      </div>
      <div><Label className="text-xs text-gray-400 mb-1 block">URL *</Label><Input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_visible} onChange={e => setForm({ ...form, is_visible: e.target.checked })} className="w-4 h-4 rounded" />
          <span className="text-xs text-gray-400">Visible on site</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_primary} onChange={e => setForm({ ...form, is_primary: e.target.checked })} className="w-4 h-4 rounded" />
          <span className="text-xs text-gray-400">Primary / featured</span>
        </label>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} disabled={loading}><Check className="w-3 h-3 mr-1" />{editing ? "Save" : "Add WebApp"}</Button>
        <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setEditing(null); setForm(empty); }}><X className="w-3 h-3 mr-1" />Cancel</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <p className="text-xs" style={{ color: "#6b7280" }}>
        Toggle apps on or off to control what appears in the Featured WebApps section on the homepage.
      </p>
      {apps.map(app => (
        <div key={app.id} className="rounded-xl overflow-hidden" style={{ background: "#111827", border: `1px solid ${app.is_visible ? "rgba(45,212,191,0.15)" : "rgba(255,255,255,0.06)"}` }}>
          {editing === app.id ? (
            <div className="p-4"><AppForm /></div>
          ) : (
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${app.is_visible ? "bg-emerald-400" : "bg-gray-600"}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{app.name}</p>
                  <p className="text-xs truncate" style={{ color: "#6b7280" }}>{app.url.replace(/^https?:\/\//, "")}</p>
                </div>
                {app.is_primary && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>featured</span>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleToggleVisible(app)}
                  className="p-1.5 rounded hover:bg-white/5 transition-colors"
                  title={app.is_visible ? "Hide from site" : "Show on site"}
                >
                  {app.is_visible
                    ? <Eye className="w-4 h-4" style={{ color: "#2dd4bf" }} />
                    : <EyeOff className="w-4 h-4" style={{ color: "#4b5563" }} />
                  }
                </button>
                <a href={app.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-white/5">
                  <ExternalLink className="w-3.5 h-3.5" style={{ color: "#4b5563" }} />
                </a>
                <button onClick={() => { setEditing(app.id); setForm({ name: app.name, url: app.url, icon: app.icon, display_order: app.display_order, is_primary: app.is_primary, is_visible: app.is_visible }); }} className="p-1.5 rounded hover:bg-white/5">
                  <Pencil className="w-3.5 h-3.5" style={{ color: "#4b5563" }} />
                </button>
                <button onClick={() => handleDelete(app.id)} className="p-1.5 rounded hover:bg-white/5">
                  <Trash2 className="w-3.5 h-3.5 text-red-500/60" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      {adding ? (
        <AppForm />
      ) : (
        <Button variant="outline" className="w-full" onClick={() => { setAdding(true); setEditing(null); setForm(empty); }}>
          <Plus className="w-4 h-4 mr-2" />Add WebApp
        </Button>
      )}
    </div>
  );
};

/* ── TOOLS ─────────────────────────────────────────────────── */
const ToolsSection = () => (
  <div className="space-y-3">
    <p className="text-xs" style={{ color: "#6b7280" }}>Your most-used platforms and workspaces — one click away.</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {TOOLS.map(t => (
        <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-4 py-3 hover:opacity-80 transition-opacity"
          style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-xl">{t.icon}</span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">{t.name}</p>
            <p className="text-xs truncate" style={{ color: "#6b7280" }}>{t.desc}</p>
          </div>
          <ExternalLink className="w-3.5 h-3.5 ml-auto shrink-0" style={{ color: "#4b5563" }} />
        </a>
      ))}
    </div>
  </div>
);

/* ── SITE SETTINGS ─────────────────────────────────────────── */
const SiteSection = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-4">
      <p className="text-xs" style={{ color: "#6b7280" }}>
        Manage public-facing site content: blog posts, FAQs, and the header download link.
      </p>
      <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
        Open Site Settings
      </Button>
      <AdminSettingsModal open={open} onOpenChange={setOpen} />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects",  label: "Projects",  icon: FolderKanban },
  { id: "clients",   label: "Clients",   icon: Users },
  { id: "quotes",    label: "Quotes",    icon: FileText },
  { id: "catalog",   label: "Catalog",   icon: Package },
  { id: "webapps",   label: "WebApps",   icon: LayoutGrid },
  { id: "tools",     label: "Tools",     icon: Wrench },
  { id: "site",      label: "Site",      icon: Globe2 },
];

const AdminPage = () => {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkey === ADMIN_PASSKEY) { setAuthed(true); setError(""); }
    else { setError("Incorrect passkey"); }
  };

  useEffect(() => {
    if (!authed) return;
    supabase.from("admin_projects").select("*").order("display_order").then(({ data }) => setProjects(data || []));
    supabase.from("admin_clients").select("*").order("created_at", { ascending: false }).then(({ data }) => setClients(data || []));
    supabase.from("admin_quotes").select("*").order("created_at", { ascending: false }).then(({ data }) => setQuotes(data || []));
  }, [authed]);

  /* ── LOCK SCREEN ── */
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#090e1a] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)" }}>
              <Lock className="w-5 h-5" style={{ color: "#2dd4bf" }} />
            </div>
            <h1 className="text-xl font-medium text-white">Admin Access</h1>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>Palawan Collective Command Center</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-3">
            <Input type="password" placeholder="Enter passkey" value={passkey} onChange={e => setPasskey(e.target.value)} autoFocus className="text-center text-lg tracking-widest" />
            {error && <p className="text-xs text-center text-red-400">{error}</p>}
            <Button type="submit" className="w-full">Enter</Button>
          </form>
          <button onClick={() => navigate("/")} className="w-full text-center text-xs mt-4" style={{ color: "#4b5563" }}>
            ← Back to site
          </button>
        </div>
      </div>
    );
  }

  /* ── MAIN ADMIN ── */
  return (
    <div className="min-h-screen" style={{ background: "#090e1a" }}>
      {/* Top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 h-14" style={{ background: "#0d1422", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-4 h-4" style={{ color: "#6b7280" }} />
          </button>
          <span className="text-sm font-medium text-white">Command Center</span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(45,212,191,0.1)", color: "#2dd4bf" }}>
            Palawan Collective
          </span>
        </div>
        <button onClick={() => setAuthed(false)} className="text-xs" style={{ color: "#4b5563" }}>Lock</button>
      </div>

      <div className="flex flex-col sm:flex-row min-h-[calc(100vh-56px)]">
        {/* Sidebar nav */}
        <div className="sm:w-52 shrink-0 sm:sticky sm:top-14 sm:h-[calc(100vh-56px)] sm:overflow-y-auto" style={{ background: "#0d1422", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex sm:flex-col gap-1 p-2 overflow-x-auto sm:overflow-x-visible">
            {NAV.map(n => (
              <button key={n.id} onClick={() => setTab(n.id)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors w-full text-left"
                style={tab === n.id
                  ? { background: "rgba(45,212,191,0.1)", color: "#2dd4bf", border: "1px solid rgba(45,212,191,0.15)" }
                  : { color: "#6b7280", border: "1px solid transparent" }
                }>
                <n.icon className="w-4 h-4 shrink-0" />
                {n.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg font-medium text-white mb-5">
              {NAV.find(n => n.id === tab)?.label}
            </h2>
            {tab === "dashboard" && <DashboardSection projects={projects} clients={clients} quotes={quotes} />}
            {tab === "projects"  && <ProjectsSection />}
            {tab === "clients"   && <ClientsSection />}
            {tab === "quotes"    && <QuotesSection />}
            {tab === "catalog"   && <CatalogSection />}
            {tab === "webapps"   && <WebAppsSection />}
            {tab === "tools"     && <ToolsSection />}
            {tab === "site"      && <SiteSection />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
