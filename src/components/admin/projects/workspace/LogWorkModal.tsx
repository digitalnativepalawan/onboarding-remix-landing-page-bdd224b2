import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { nextInvoiceNumber } from "@/components/admin/quotes/types";

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: string;
  defaultDescription?: string;
}

export function LogWorkModal({ open, onClose, projectId, defaultDescription = "" }: Props) {
  const qc = useQueryClient();
  const isMobile = useIsMobile();
  const [description, setDescription] = useState(defaultDescription);
  const [hours, setHours] = useState<string>("");
  const [qty, setQty] = useState<string>("1");
  const [unitPrice, setUnitPrice] = useState<string>("");
  const [loggedOn, setLoggedOn] = useState(new Date().toISOString().slice(0, 10));
  const [pushTo, setPushTo] = useState<string>("__new__");
  const [clientId, setClientId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setDescription(defaultDescription);
      setHours("");
      setQty("1");
      setUnitPrice("");
      setLoggedOn(new Date().toISOString().slice(0, 10));
      setPushTo("__new__");
    }
  }, [open, defaultDescription]);

  // Load project (to get client_id) and clients
  const { data: project } = useQuery({
    queryKey: ["project-for-log", projectId],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("*").eq("id", projectId).maybeSingle();
      return data;
    },
    enabled: open,
  });

  useEffect(() => {
    if (project && (project as any).client_id) setClientId((project as any).client_id);
  }, [project]);

  const { data: clients = [] } = useQuery({
    queryKey: ["clients-min"],
    queryFn: async () => {
      const { data } = await supabase.from("clients").select("id, business_name").order("business_name");
      return data ?? [];
    },
    enabled: open,
  });

  const { data: openQuotes = [] } = useQuery({
    queryKey: ["open-quotes-for-client", clientId],
    queryFn: async () => {
      if (!clientId) return [];
      const { data } = await supabase
        .from("quotes")
        .select("id, title, invoice_number, status, total_php")
        .eq("client_id", clientId)
        .in("status", ["draft", "sent", "viewed"])
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: open && !!clientId,
  });

  // Auto hours -> qty
  useEffect(() => {
    if (hours && Number(hours) > 0) setQty(hours);
  }, [hours]);

  const lineTotal = (Number(qty) || 0) * (Number(unitPrice) || 0);

  const handleSave = async () => {
    if (!description.trim()) return toast.error("Add a description");
    if (!clientId) return toast.error("Pick a client first");
    if (!unitPrice || Number(unitPrice) <= 0) return toast.error("Set a unit price");

    setSaving(true);
    try {
      // Ensure project has client_id
      if (project && !(project as any).client_id) {
        await supabase.from("projects").update({ client_id: clientId }).eq("id", projectId);
      }

      let quoteId = pushTo === "__new__" ? null : pushTo;

      // Create new draft quote if needed
      if (!quoteId) {
        const { data: existingNumbers } = await supabase
          .from("quotes")
          .select("invoice_number")
          .not("invoice_number", "is", null);
        const invNum = nextInvoiceNumber((existingNumbers ?? []).map((r: any) => r.invoice_number));
        const { data: newQuote, error: qErr } = await supabase
          .from("quotes")
          .insert({
            client_id: clientId,
            title: (project as any)?.name ? `${(project as any).name} — Work log` : "Work log",
            status: "draft",
            invoice_number: invNum,
            invoice_date: loggedOn,
            currency: "PHP",
          })
          .select()
          .single();
        if (qErr || !newQuote) throw qErr ?? new Error("Failed to create quote");
        quoteId = newQuote.id;
      }

      // Insert quote_item
      const qtyNum = Number(qty) || 1;
      const upNum = Number(unitPrice) || 0;
      const { data: item, error: itemErr } = await supabase
        .from("quote_items")
        .insert({
          quote_id: quoteId!,
          name: description.slice(0, 80),
          description: hours ? `${description} (${hours}h on ${loggedOn})` : `${description} (${loggedOn})`,
          qty: qtyNum,
          unit_price_php: upNum,
          line_total_php: qtyNum * upNum,
        })
        .select()
        .single();
      if (itemErr) throw itemErr;

      // Insert work_log
      await supabase.from("work_logs").insert({
        project_id: projectId,
        client_id: clientId,
        quote_id: quoteId,
        quote_item_id: item?.id ?? null,
        description,
        hours: hours ? Number(hours) : null,
        qty: qtyNum,
        unit_price_php: upNum,
        logged_on: loggedOn,
      });

      // Recalculate quote totals
      const { data: allItems } = await supabase
        .from("quote_items")
        .select("line_total_php")
        .eq("quote_id", quoteId!);
      const subtotal = (allItems ?? []).reduce((s: number, i: any) => s + Number(i.line_total_php || 0), 0);
      await supabase.from("quotes").update({ subtotal_php: subtotal, total_php: subtotal, total_amount: subtotal }).eq("id", quoteId!);

      // Activity log
      await supabase.from("activity_log").insert({
        entity_type: "work_logs",
        entity_id: projectId,
        action: "created",
        summary: `Logged work: ${description.slice(0, 60)} · ₱${Math.round(qtyNum * upNum).toLocaleString()}`,
      });

      const targetQuote = openQuotes.find((q: any) => q.id === quoteId);
      const label = targetQuote?.invoice_number || targetQuote?.title || "draft quote";
      toast.success(`Logged · Pushed to ${label}`);
      qc.invalidateQueries({ queryKey: ["project-activity", projectId] });
      qc.invalidateQueries({ queryKey: ["quotes"] });
      onClose();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to log work");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className={
          isMobile
            ? "h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] max-w-none max-h-none flex flex-col"
            : "max-w-lg"
        }
      >
        <DialogHeader>
          <DialogTitle>Log billable work</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 overflow-y-auto flex-1">
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What did you do?" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Hours (optional)</Label>
              <Input type="number" step="0.25" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="e.g. 1.5" />
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={loggedOn} onChange={(e) => setLoggedOn(e.target.value)} />
            </div>
            <div>
              <Label>Quantity</Label>
              <Input type="number" step="0.25" value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>
            <div>
              <Label>Unit price (PHP)</Label>
              <Input type="number" step="1" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="1500" />
            </div>
          </div>
          <div className="rounded-md bg-muted p-2 text-sm flex justify-between">
            <span>Line total</span>
            <span className="font-semibold">₱{Math.round(lineTotal).toLocaleString()}</span>
          </div>

          <div>
            <Label>Client</Label>
            <Select value={clientId ?? ""} onValueChange={(v) => setClientId(v)}>
              <SelectTrigger><SelectValue placeholder="Pick client" /></SelectTrigger>
              <SelectContent>
                {clients.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.business_name}</SelectItem>)}
              </SelectContent>
            </Select>
            {project && !(project as any).client_id && clientId && (
              <p className="text-xs text-muted-foreground mt-1">This will link the project to the client.</p>
            )}
          </div>

          <div>
            <Label>Push to</Label>
            <Select value={pushTo} onValueChange={setPushTo}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__new__">+ Create new draft quote</SelectItem>
                {openQuotes.map((q: any) => (
                  <SelectItem key={q.id} value={q.id}>
                    {q.invoice_number || q.title} · {q.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Log & push"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}