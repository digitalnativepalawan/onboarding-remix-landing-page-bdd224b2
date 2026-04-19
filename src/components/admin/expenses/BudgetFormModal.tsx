import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORY_OPTIONS } from "./types";
import { Trash2 } from "lucide-react";

export interface BudgetRow {
  id?: string;
  category: string;
  month: number;
  year: number;
  budget_php: number;
  notes?: string | null;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  budget: BudgetRow | null;
  defaultMonth: number;
  defaultYear: number;
  onSaved: () => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function BudgetFormModal({ open, onOpenChange, budget, defaultMonth, defaultYear, onSaved }: Props) {
  const [form, setForm] = useState<BudgetRow>({
    category: "subscriptions",
    month: defaultMonth,
    year: defaultYear,
    budget_php: 0,
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (budget) setForm({ ...budget });
    else setForm({ category: "subscriptions", month: defaultMonth, year: defaultYear, budget_php: 0, notes: "" });
  }, [budget, defaultMonth, defaultYear, open]);

  const save = async () => {
    if (!form.category || form.budget_php <= 0) {
      return toast.error("Pick a category and enter an amount > 0");
    }
    setSaving(true);
    const payload = {
      category: form.category,
      month: form.month,
      year: form.year,
      budget_php: Number(form.budget_php),
      notes: form.notes || null,
    };
    const { error } = form.id
      ? await supabase.from("expense_budgets").update(payload).eq("id", form.id)
      : await supabase.from("expense_budgets").insert(payload);
    setSaving(false);
    if (error) {
      if (error.code === "23505") return toast.error("A budget already exists for this category in that month");
      return toast.error(error.message);
    }
    toast.success(form.id ? "Budget updated" : "Budget created");
    onOpenChange(false);
    onSaved();
  };

  const remove = async () => {
    if (!form.id) return;
    if (!confirm("Delete this budget?")) return;
    const { error } = await supabase.from("expense_budgets").delete().eq("id", form.id);
    if (error) return toast.error(error.message);
    toast.success("Budget deleted");
    onOpenChange(false);
    onSaved();
  };

  const years = Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - 3 + i);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit budget" : "New budget"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Month</Label>
              <Select value={String(form.month)} onValueChange={(v) => setForm({ ...form, month: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Year</Label>
              <Select value={String(form.year)} onValueChange={(v) => setForm({ ...form, year: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {years.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Budget amount (PHP)</Label>
            <Input
              type="number"
              min={0}
              step={100}
              value={form.budget_php}
              onChange={(e) => setForm({ ...form, budget_php: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label className="text-xs">Notes (optional)</Label>
            <Input value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
        <DialogFooter className="flex sm:justify-between gap-2">
          {form.id ? (
            <Button variant="ghost" size="sm" onClick={remove} className="text-rose-400">
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
            </Button>
          ) : <span />}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button size="sm" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
