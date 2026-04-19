import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { QuoteDraft, formatPHP, calcTotals } from "./types";

export interface PdfBranding {
  companyName?: string | null;
  tagline?: string | null;
  addressLine?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  country?: string | null;
  email?: string | null;
  phone?: string | null;
  copyrightHolder?: string | null;
  logoUrl?: string | null;
}

async function loadImageDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateQuotePDF(
  quote: QuoteDraft,
  clientName: string,
  branding: PdfBranding = {},
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  const isInvoice = !!quote.invoice_number;
  const totals = calcTotals(quote.items, quote.tax_rate, quote.discount_amount);
  const currency = quote.currency || "PHP";
  const fmt = (n: number) => `${currency} ${Math.round(n).toLocaleString()}`;

  // Logo (top-right)
  if (branding.logoUrl) {
    const dataUrl = await loadImageDataUrl(branding.logoUrl);
    if (dataUrl) {
      try {
        doc.addImage(dataUrl, "PNG", pageWidth - 44, 12, 30, 30, undefined, "FAST");
      } catch {
        // ignore image errors
      }
    }
  }

  // Title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(isInvoice ? "INVOICE" : "QUOTE", 14, 22);

  // Company block under title
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(branding.companyName || "Company", 14, 30);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  let cy = 35;
  if (branding.tagline) { doc.text(branding.tagline, 14, cy); cy += 4; }
  if (branding.addressLine) { doc.text(branding.addressLine, 14, cy); cy += 4; }
  const cityLine = [branding.city, branding.province, branding.postalCode].filter(Boolean).join(", ");
  if (cityLine) { doc.text(cityLine, 14, cy); cy += 4; }
  if (branding.country) { doc.text(branding.country, 14, cy); cy += 4; }
  if (branding.email) { doc.text(branding.email, 14, cy); cy += 4; }
  if (branding.phone) { doc.text(branding.phone, 14, cy); cy += 4; }

  // Meta box (right)
  let my = 50;
  doc.setFontSize(9);
  const metaRow = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, pageWidth - 60, my);
    doc.setFont("helvetica", "normal");
    doc.text(value, pageWidth - 14, my, { align: "right" });
    my += 5;
  };
  if (quote.invoice_number) metaRow("Invoice #", quote.invoice_number);
  if (quote.invoice_date) metaRow("Issued", quote.invoice_date);
  if (quote.due_date) metaRow("Due", quote.due_date);
  if (quote.valid_until && !isInvoice) metaRow("Valid until", quote.valid_until);
  if (quote.payment_terms) metaRow("Terms", quote.payment_terms);

  // Bill To
  const billY = Math.max(cy, my) + 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", 14, billY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(clientName || "—", 14, billY + 5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("PROJECT", 14, billY + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(quote.title || "—", 14, billY + 19);

  // Items table
  autoTable(doc, {
    startY: billY + 26,
    head: [["Item", "Description", "Qty", `Unit (${currency})`, `Total (${currency})`]],
    body: quote.items.map((it) => [
      it.name,
      it.description || "",
      String(it.qty),
      Math.round(it.unit_price_php).toLocaleString(),
      Math.round(it.line_total_php).toLocaleString(),
    ]),
    headStyles: { fillColor: [30, 30, 30] },
    styles: { fontSize: 9 },
    columnStyles: {
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" },
    },
  });

  // Totals
  let y = (doc as any).lastAutoTable.finalY + 8;
  const totalsX = pageWidth - 14;
  const labelX = pageWidth - 70;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const totalRow = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(label, labelX, y);
    doc.text(value, totalsX, y, { align: "right" });
    y += 6;
  };

  totalRow("Subtotal", fmt(totals.subtotal));
  if (totals.discount > 0) totalRow("Discount", `- ${fmt(totals.discount)}`);
  if ((quote.tax_rate || 0) > 0) totalRow(`Tax (${quote.tax_rate}%)`, fmt(totals.taxAmount));
  doc.setDrawColor(180);
  doc.line(labelX, y - 3, totalsX, y - 3);
  doc.setFontSize(12);
  totalRow("TOTAL", fmt(totals.total), true);
  doc.setFontSize(10);

  // Payment methods
  const enabledPayments: string[] = [];
  if (quote.payment_cash_enabled) enabledPayments.push("Cash");
  if (quote.payment_gcash_enabled && quote.payment_gcash_number)
    enabledPayments.push(`GCash · ${quote.payment_gcash_number}`);
  if (quote.payment_bank_enabled && quote.payment_bank_name)
    enabledPayments.push(
      `${quote.payment_bank_name} · ${quote.payment_bank_account_name ?? ""} · ${quote.payment_bank_account_number ?? ""}`.trim(),
    );

  if (enabledPayments.length || (quote.payment_qr_enabled && quote.payment_qr_url)) {
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Payment options", 14, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    enabledPayments.forEach((p) => {
      doc.text(`• ${p}`, 14, y);
      y += 4.5;
    });

    if (quote.payment_qr_enabled && quote.payment_qr_url) {
      const qrData = await loadImageDataUrl(quote.payment_qr_url);
      if (qrData) {
        try {
          doc.addImage(qrData, "PNG", pageWidth - 44, y - 4, 30, 30, undefined, "FAST");
          doc.setFontSize(8);
          doc.text("Scan to pay", pageWidth - 29, y + 30, { align: "center" });
          y = Math.max(y, y + 30);
        } catch {
          // ignore
        }
      }
    }
    doc.setFontSize(10);
  }

  // Notes / terms
  y += 6;
  const customerNotes = quote.notes_customer || quote.notes;
  if (customerNotes) {
    doc.setFont("helvetica", "bold");
    doc.text("Notes", 14, y);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(customerNotes, pageWidth - 28);
    doc.text(lines, 14, y + 5);
    y += 5 + lines.length * 4.5 + 4;
  }
  if (quote.terms) {
    doc.setFont("helvetica", "bold");
    doc.text("Terms", 14, y);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(quote.terms, pageWidth - 28);
    doc.text(lines, 14, y + 5);
    y += 5 + lines.length * 4.5;
  }

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(140);
  const year = new Date().getFullYear();
  doc.text(
    `© ${year} ${branding.copyrightHolder || branding.companyName || ""}`,
    pageWidth / 2,
    pageHeight - 8,
    { align: "center" },
  );

  const fileName = isInvoice
    ? `${quote.invoice_number}.pdf`
    : `quote-${quote.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.pdf`;
  doc.save(fileName);
}
