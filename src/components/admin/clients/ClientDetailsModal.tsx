import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import {
  Mail, Phone, MapPin, Facebook, Calendar, DollarSign,
  FileText, MessageSquare, Pencil, Trash2,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Client, fmtPhp, PIPELINE_STAGES } from "./types";

interface Props {
  open: boolean;
  onClose: () => void;
  client: Client | null;
  onEdit: () => void;
  onChanged: () => void;
}

export function ClientDetailsModal({ open, onClose, client, onEdit, onChanged }: Props) {
  const [notes, setNotes] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");

  const fetchAll = async () => {
    if (!client) return;
    const [n, r, q] = await Promise.all([
      supabase.from("client_notes").select("*").eq("client_id", client.id).order("created_at", { ascending: false }),
      supabase.from("revenue").select("*").eq("client_id", client.id).order("payment_date", { ascending: false }),
      supabase.from("quotes").select("*").eq("client_id", client.id).order("created_at", { ascending: false }),
    ]);
    setNotes(n.data || []);
    setRevenue(r.data || []);
    setQuotes(q.data || []);
  };

  useEffect(() => {
    if (open && client) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, client?.id]);

  const addNote = async () => {
    if (!newNote.trim() || !client) return;
    const { error } = await supabase.from("client_notes").insert({
      client_id: client.id, content: newNote.trim(),
    });
    if (error) return toast.error(error.message);
    setNewNote("");
    fetchAll();
    toast.success("Note added");
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase.from("client_notes").delete().eq("id", id);
    if (error) return toast.error(error.message);
    fetchAll();
  };

  if (!client) return null;
  const stage = PIPELINE_STAGES.find((s) => s.id === client.pipeline_stage);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <DialogTitle className="truncate">{client.business_name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                {stage && (
                  <span className={`text-xs px-2 py-0.5 rounded border ${stage.color}`}>
                    {stage.label}
                  </span>
                )}
                {client.business_type && (
                  <span className="text-xs text-muted-foreground">{client.business_type}</span>
                )}
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Pencil className="w-3 h-3 mr-1" /> Edit
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          {/* contact */}
          <div className="space-y-2 text-sm">
            <h4 className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Contact</h4>
            {client.contact_name && <p className="font-medium">{client.contact_name}</p>}
            {client.whatsapp && (
              <a href={`https://wa.me/${client.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs hover:text-primary">
                <Phone className="w-3 h-3" /> {client.whatsapp}
              </a>
            )}
            {client.email && (
              <a href={`mailto:${client.email}`} className="flex items-center gap-2 text-xs hover:text-primary">
                <Mail className="w-3 h-3" /> {client.email}
              </a>
            )}
            {client.location && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" /> {client.location}
              </p>
            )}
            {client.facebook_url && (
              <a href={client.facebook_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs hover:text-primary">
                <Facebook className="w-3 h-3" /> Facebook
              </a>
            )}
          </div>

          {/* values */}
          <div className="space-y-2 text-sm">
            <h4 className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Value</h4>
            <p className="text-xs flex items-center gap-2">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              Estimated: <span className="font-mono">{fmtPhp(client.estimated_value_php)}</span>
            </p>
            <p className="text-xs flex items-center gap-2">
              <DollarSign className="w-3 h-3 text-blue-400" />
              MRR: <span className="font-mono">{fmtPhp(client.monthly_recurring_php)}</span>
            </p>
            {client.last_contact_date && (
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Last contact: {format(parseISO(client.last_contact_date), "MMM d, yyyy")}
              </p>
            )}
            {client.follow_up_date && (
              <p className="text-xs text-amber-400 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Follow up: {format(parseISO(client.follow_up_date), "MMM d, yyyy")}
              </p>
            )}
            {client.pitch_sent_date && (
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Pitch sent: {format(parseISO(client.pitch_sent_date), "MMM d, yyyy")}
              </p>
            )}
          </div>

          {/* service interests */}
          {client.service_interests && client.service_interests.length > 0 && (
            <div className="md:col-span-2 space-y-2">
              <h4 className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Service interests</h4>
              <div className="flex flex-wrap gap-1.5">
                {client.service_interests.map((s) => (
                  <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                ))}
              </div>
            </div>
          )}

          {client.notes && (
            <div className="md:col-span-2 space-y-1">
              <h4 className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">General notes</h4>
              <p className="text-xs whitespace-pre-wrap text-muted-foreground bg-muted/30 p-2 rounded">{client.notes}</p>
            </div>
          )}

          {/* notes timeline */}
          <div className="md:col-span-2 space-y-2">
            <h4 className="text-xs uppercase tracking-wide text-muted-foreground font-semibold flex items-center gap-2">
              <MessageSquare className="w-3 h-3" /> Notes timeline
            </h4>
            <div className="flex gap-2">
              <Textarea
                rows={2}
                placeholder="Add a note…"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="text-xs"
              />
              <Button size="sm" onClick={addNote} disabled={!newNote.trim()}>Add</Button>
            </div>
            {notes.length === 0 ? (
              <p className="text-[11px] text-muted-foreground text-center py-3">No notes yet</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {notes.map((n) => (
                  <div key={n.id} className="text-xs bg-muted/30 p-2 rounded flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="whitespace-pre-wrap break-words">{n.content}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {format(parseISO(n.created_at), "MMM d, yyyy HH:mm")}
                      </p>
                    </div>
                    <button onClick={() => deleteNote(n.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* revenue */}
          {revenue.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Revenue</h4>
              <div className="space-y-1">
                {revenue.map((r) => (
                  <div key={r.id} className="text-xs flex items-center justify-between bg-muted/20 px-2 py-1 rounded">
                    <span className="capitalize">{r.type}</span>
                    <span className="font-mono">{fmtPhp(Number(r.amount_php))}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* quotes */}
          {quotes.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wide text-muted-foreground font-semibold flex items-center gap-2">
                <FileText className="w-3 h-3" /> Quotes
              </h4>
              <div className="space-y-1">
                {quotes.map((q) => (
                  <div key={q.id} className="text-xs flex items-center justify-between bg-muted/20 px-2 py-1 rounded">
                    <span className="truncate flex-1">{q.title}</span>
                    <Badge variant="outline" className="text-[9px] ml-2">{q.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
