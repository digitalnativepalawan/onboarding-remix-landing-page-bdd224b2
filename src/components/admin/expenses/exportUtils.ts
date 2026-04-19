import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { supabase } from "@/integrations/supabase/client";
import type { ExpenseRow } from "./types";
import type { SiteSettings } from "@/hooks/useSiteSettings";

const todayStr = () => new Date().toISOString().slice(0, 10);

const fmtPHP = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 2 }).format(n || 0);

const csvEscape = (val: unknown): string => {
  if (val === null || val === undefined) return "";
  const s = Array.isArray(val) ? val.join("; ") : String(val);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

const CSV_COLUMNS: { key: keyof ExpenseRow; label: string }[] = [
  { key: "expense_date", label: "Date" },
  { key: "expense_name", label: "Name" },
  { key: "category", label: "Category" },
  { key: "vendor_name", label: "Vendor" },
  { key: "description", label: "Description" },
  { key: "amount", label: "Amount" },
  { key: "currency", label: "Currency" },
  { key: "amount_php", label: "Amount (PHP)" },
  { key: "payment_method", label: "Payment Method" },
  { key: "payment_reference", label: "Payment Reference" },
  { key: "invoice_number", label: "Invoice #" },
  { key: "expense_type", label: "Type" },
  { key: "is_recurring", label: "Recurring" },
  { key: "recurring_frequency", label: "Frequency" },
  { key: "next_recurring_date", label: "Next Due" },
  { key: "is_billable", label: "Billable" },
  { key: "client_id", label: "Client ID" },
  { key: "project_id", label: "Project ID" },
  { key: "quote_id", label: "Quote ID" },
  { key: "status", label: "Status" },
  { key: "tags", label: "Tags" },
  { key: "notes", label: "Notes" },
  { key: "receipt_url", label: "Receipt URL" },
  { key: "created_at", label: "Created" },
];

export function exportExpensesCSV(rows: ExpenseRow[]) {
  const header = CSV_COLUMNS.map((c) => csvEscape(c.label)).join(",");
  const lines = rows.map((r) => CSV_COLUMNS.map((c) => csvEscape(r[c.key])).join(","));
  const csv = "\uFEFF" + [header, ...lines].join("\r\n"); // UTF-8 BOM
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  saveAs(blob, `merQato-Expenses-${todayStr()}.csv`);
}

export function exportExpensesPDF(rows: ExpenseRow[], settings: SiteSettings, period?: { from?: string; to?: string }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  let y = 40;

  // Header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(settings.company_name || "Expense Report", 40, y);
  y += 18;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const addr = [settings.address_line, settings.city, settings.province, settings.postal_code, settings.country]
    .filter(Boolean)
    .join(", ");
  if (addr) { doc.text(addr, 40, y); y += 12; }
  const contact = [settings.contact_email, settings.contact_phone].filter(Boolean).join(" • ");
  if (contact) { doc.text(contact, 40, y); y += 12; }

  // Title
  y += 10;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Expense Report", 40, y);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated ${new Date().toLocaleString()}`, W - 40, y, { align: "right" });
  y += 8;
  if (period?.from || period?.to) {
    y += 10;
    doc.setFontSize(10);
    doc.text(`Period: ${period.from || "—"} to ${period.to || "—"}`, 40, y);
  }
  y += 14;

  // Summary
  const total = rows.reduce((s, r) => s + (Number(r.amount_php) || 0), 0);
  const recurring = rows.filter((r) => r.is_recurring).length;
  const billable = rows.filter((r) => r.is_billable).length;

  doc.setDrawColor(220);
  doc.setFillColor(245, 245, 245);
  doc.rect(40, y, W - 80, 50, "F");
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text("TOTAL SPENT", 52, y + 16);
  doc.text("EXPENSES", 200, y + 16);
  doc.text("RECURRING", 320, y + 16);
  doc.text("BILLABLE", 430, y + 16);
  doc.setTextColor(0);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(fmtPHP(total), 52, y + 36);
  doc.text(String(rows.length), 200, y + 36);
  doc.text(String(recurring), 320, y + 36);
  doc.text(String(billable), 430, y + 36);
  doc.setFont("helvetica", "normal");
  y += 70;

  // Category breakdown
  const byCat = new Map<string, { count: number; total: number }>();
  rows.forEach((r) => {
    const c = r.category || "miscellaneous";
    const cur = byCat.get(c) ?? { count: 0, total: 0 };
    cur.count += 1;
    cur.total += Number(r.amount_php) || 0;
    byCat.set(c, cur);
  });
  const catRows = Array.from(byCat.entries())
    .sort((a, b) => b[1].total - a[1].total)
    .map(([cat, v]) => [
      cat,
      String(v.count),
      fmtPHP(v.total),
      total ? `${((v.total / total) * 100).toFixed(1)}%` : "0%",
    ]);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Category Breakdown", 40, y);
  y += 6;
  autoTable(doc, {
    startY: y + 4,
    head: [["Category", "Count", "Total (PHP)", "% of Total"]],
    body: catRows,
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [30, 30, 30] },
    margin: { left: 40, right: 40 },
  });
  y = (doc as any).lastAutoTable.finalY + 20;

  // Full expense table
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Expenses", 40, y);
  autoTable(doc, {
    startY: y + 6,
    head: [["Date", "Name", "Category", "Vendor", "Amount (PHP)"]],
    body: rows.map((r) => [
      r.expense_date,
      r.expense_name,
      r.category,
      r.vendor_name || "—",
      fmtPHP(Number(r.amount_php) || 0),
    ]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [30, 30, 30] },
    columnStyles: { 4: { halign: "right" } },
    margin: { left: 40, right: 40 },
    didDrawPage: () => {
      const pn = (doc as any).internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Page ${pn} • ${settings.company_name || ""}`,
        W / 2,
        doc.internal.pageSize.getHeight() - 20,
        { align: "center" }
      );
      doc.setTextColor(0);
    },
  });

  doc.save(`merQato-Expense-Report-${todayStr()}.pdf`);
}

export async function exportReceiptsZIP(rows: ExpenseRow[], onProgress?: (n: number, total: number) => void) {
  const withReceipts = rows.filter((r) => r.receipt_path);
  if (withReceipts.length === 0) {
    throw new Error("No receipts to export in the selected range.");
  }
  const zip = new JSZip();
  let i = 0;
  for (const r of withReceipts) {
    i += 1;
    onProgress?.(i, withReceipts.length);
    try {
      const { data, error } = await supabase.storage.from("receipts").download(r.receipt_path!);
      if (error || !data) continue;
      const ext = r.receipt_path!.split(".").pop() || "bin";
      const safeName = `${r.expense_date}_${r.expense_name}_${r.id.slice(0, 6)}`.replace(/[^a-z0-9_\-]/gi, "_");
      zip.file(`${safeName}.${ext}`, data);
    } catch {
      // skip individual failures
    }
  }
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `merQato-Receipts-${todayStr()}.zip`);
}
