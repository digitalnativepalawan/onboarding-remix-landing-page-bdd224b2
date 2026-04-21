import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { QuoteDraft, calcTotals } from "./types";

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
  primaryColor?: string | null; // hex like #2dd4bf
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

function hexToRgb(hex?: string | null): [number, number, number] {
  const fallback: [number, number, number] = [30, 30, 30];
  if (!hex) return fallback;
  const m = hex.replace("#", "");
  if (m.length !== 6) return fallback;
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return fallback;
  return [r, g, b];
}

function slug(s: string) {
  return (s || "").replace(/[^a-z0-9]/gi, "-").replace(/-+/g, "-").toLowerCase().replace(/^-|-$/g, "");
}

export async function generateQuotePDF(
  quote: QuoteDraft,
  clientName: string,
  branding: PdfBranding = {},
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const M = 14; // margin
  const brand = hexToRgb(branding.primaryColor);

  const isInvoice = !!quote.invoice_number;
  const totals = calcTotals(quote.items, quote.tax_rate, quote.discount_amount);
  const currency = quote.currency || "PHP";
  const money = (n: number) =>
    new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);
  const fmt = (n: number) => `${currency} ${money(n)}`;

  // ===== HEADER BAND =====
  // Logo (left)
  let logoBottom = M;
  if (branding.logoUrl) {
    const dataUrl = await loadImageDataUrl(branding.logoUrl);
    if (dataUrl) {
      try {
        doc.addImage(dataUrl, "PNG", M, M, 28, 28, undefined, "FAST");
        logoBottom = M + 28;
      } catch { /* ignore */ }
    }
  }

  // Company block (under logo / left side)
  doc.setTextColor(20, 20, 20);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(branding.companyName || "Company", M, logoBottom + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(110, 110, 110);
  if (branding.tagline) doc.text(branding.tagline, M, logoBottom + 11);

  // Title block (right)
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text(isInvoice ? "INVOICE" : "QUOTE", pageWidth - M, M + 10, { align: "right" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(90, 90, 90);
  let metaY = M + 16;
  const metaRow = (label: string, value: string) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(130, 130, 130);
    doc.text(label, pageWidth - M - 38, metaY, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text(value, pageWidth - M, metaY, { align: "right" });
    metaY += 5;
  };
  if (quote.invoice_number) metaRow("Number", quote.invoice_number);
  if (quote.invoice_date) metaRow("Issued", quote.invoice_date);
  if (quote.due_date) metaRow("Due", quote.due_date);
  if (quote.valid_until && !isInvoice) metaRow("Valid until", quote.valid_until);
  if (quote.payment_terms) metaRow("Terms", quote.payment_terms);

  // Brand divider
  const dividerY = Math.max(logoBottom + 16, metaY) + 3;
  doc.setDrawColor(brand[0], brand[1], brand[2]);
  doc.setLineWidth(1.2);
  doc.line(M, dividerY, pageWidth - M, dividerY);
  doc.setLineWidth(0.2);

  // ===== FROM / BILL TO =====
  let blockY = dividerY + 8;
  const colW = (pageWidth - M * 2 - 8) / 2;

  const renderAddressBlock = (x: number, label: string, lines: string[]) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(brand[0], brand[1], brand[2]);
    doc.text(label, x, blockY);
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(10);
    let y = blockY + 5;
    lines.filter(Boolean).forEach((line, i) => {
      doc.setFont("helvetica", i === 0 ? "bold" : "normal");
      doc.setFontSize(i === 0 ? 11 : 9);
      doc.text(line, x, y);
      y += i === 0 ? 5 : 4.2;
    });
    return y;
  };

  const fromLines = [
    branding.companyName || "Company",
    branding.addressLine || "",
    [branding.city, branding.province, branding.postalCode].filter(Boolean).join(", "),
    branding.country || "",
    branding.email || "",
    branding.phone || "",
  ];
  const toLines = [clientName || "—"];

  const fromEnd = renderAddressBlock(M, "FROM", fromLines);
  const toEnd = renderAddressBlock(M + colW + 8, "BILL TO", toLines);
  let y = Math.max(fromEnd, toEnd) + 4;

  // ===== PROJECT BAR =====
  doc.setFillColor(245, 245, 247);
  doc.rect(M, y, pageWidth - M * 2, 9, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(110, 110, 110);
  doc.text("PROJECT", M + 3, y + 6);
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "normal");
  doc.text(quote.title || "—", M + 26, y + 6);
  y += 13;

  // ===== ITEMS TABLE =====
  const items = quote.items || [];
  const body = items.length
    ? items.map((it, idx) => [
        String(idx + 1),
        it.description ? `${it.name}\n${it.description}` : it.name,
        String(it.qty),
        money(it.unit_price_php),
        money(it.line_total_php),
      ])
    : [["", "No line items yet.", "", "", ""]];

  autoTable(doc, {
    startY: y,
    head: [["#", "Description", "Qty", `Unit (${currency})`, `Total (${currency})`]],
    body,
    headStyles: {
      fillColor: [30, 30, 30],
      textColor: [255, 255, 255],
      fontSize: 9,
      halign: "left",
    },
    styles: { fontSize: 9, cellPadding: 3, textColor: [40, 40, 40] },
    alternateRowStyles: { fillColor: [250, 250, 252] },
    columnStyles: {
      0: { halign: "center", cellWidth: 10, textColor: [130, 130, 130] },
      2: { halign: "right", cellWidth: 18 },
      3: { halign: "right", cellWidth: 32 },
      4: { halign: "right", cellWidth: 34, fontStyle: "bold" },
    },
    margin: { left: M, right: M },
  });

  y = (doc as any).lastAutoTable.finalY + 6;

  // ===== TOTALS =====
  const totalsX = pageWidth - M;
  const labelX = pageWidth - M - 60;
  doc.setFontSize(10);

  const totalRow = (label: string, value: string, opts: { bold?: boolean; bar?: boolean } = {}) => {
    if (opts.bar) {
      doc.setFillColor(brand[0], brand[1], brand[2]);
      doc.rect(labelX - 4, y - 5, totalsX - labelX + 4, 9, "F");
      doc.setTextColor(255, 255, 255);
    } else {
      doc.setTextColor(40, 40, 40);
    }
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.text(label, labelX, y);
    doc.text(value, totalsX, y, { align: "right" });
    doc.setTextColor(40, 40, 40);
    y += 6;
  };

  totalRow("Subtotal", money(totals.subtotal));
  if (totals.discount > 0) totalRow("Discount", `- ${money(totals.discount)}`);
  if ((quote.tax_rate || 0) > 0) totalRow(`Tax (${quote.tax_rate}%)`, money(totals.taxAmount));
  doc.setDrawColor(220);
  doc.line(labelX, y - 3, totalsX, y - 3);
  y += 1;
  doc.setFontSize(11);
  totalRow(`TOTAL (${currency})`, money(totals.total), { bold: true, bar: true });
  doc.setFontSize(10);
  y += 4;

  // ===== PAYMENT BLOCK =====
  const enabledPayments: string[] = [];
  if (quote.payment_cash_enabled) enabledPayments.push("Cash");
  if (quote.payment_gcash_enabled && quote.payment_gcash_number)
    enabledPayments.push(`GCash · ${quote.payment_gcash_number}`);
  if (quote.payment_bank_enabled && quote.payment_bank_name)
    enabledPayments.push(
      `${quote.payment_bank_name} · ${quote.payment_bank_account_name ?? ""} · ${quote.payment_bank_account_number ?? ""}`.trim(),
    );

  const hasQR = quote.payment_qr_enabled && quote.payment_qr_url;
  if (enabledPayments.length || hasQR) {
    const boxH = Math.max(35, enabledPayments.length * 5 + 16, hasQR ? 50 : 0);
    if (y + boxH > pageHeight - 30) { doc.addPage(); y = M; }

    doc.setDrawColor(225);
    doc.setFillColor(252, 252, 254);
    doc.roundedRect(M, y, pageWidth - M * 2, boxH, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(brand[0], brand[1], brand[2]);
    doc.text("PAYMENT OPTIONS", M + 4, y + 6);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    let py = y + 12;
    enabledPayments.forEach((p) => {
      doc.text(`•  ${p}`, M + 4, py);
      py += 5;
    });

    if (hasQR) {
      const qrData = await loadImageDataUrl(quote.payment_qr_url!);
      if (qrData) {
        try {
          const qrSize = 35;
          doc.addImage(qrData, "PNG", pageWidth - M - qrSize - 4, y + 6, qrSize, qrSize, undefined, "FAST");
          doc.setFontSize(7);
          doc.setTextColor(110, 110, 110);
          doc.text("Scan to pay", pageWidth - M - qrSize / 2 - 4, y + 6 + qrSize + 4, { align: "center" });
          doc.setTextColor(40, 40, 40);
        } catch { /* ignore */ }
      }
    }
    y += boxH + 6;
  }

  // ===== NOTES / TERMS =====
  const customerNotes = quote.notes_customer || quote.notes;
  const drawTextBlock = (label: string, text: string) => {
    if (!text) return;
    if (y > pageHeight - 30) { doc.addPage(); y = M; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(brand[0], brand[1], brand[2]);
    doc.text(label, M, y);
    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(text, pageWidth - M * 2);
    doc.text(lines, M, y + 5);
    y += 5 + lines.length * 4.2 + 4;
  };
  if (customerNotes) drawTextBlock("NOTES", customerNotes);
  if (quote.terms) drawTextBlock("TERMS", quote.terms);

  // ===== FOOTER (every page) =====
  const pageCount = (doc as any).internal.getNumberOfPages();
  const year = new Date().getFullYear();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setDrawColor(brand[0], brand[1], brand[2]);
    doc.setLineWidth(0.6);
    doc.line(M, pageHeight - 14, pageWidth - M, pageHeight - 14);
    doc.setLineWidth(0.2);
    doc.setFontSize(8);
    doc.setTextColor(130, 130, 130);
    doc.text(
      `© ${year} ${branding.copyrightHolder || branding.companyName || ""}`.trim(),
      M,
      pageHeight - 8,
    );
    doc.text(`Page ${p} / ${pageCount}`, pageWidth - M, pageHeight - 8, { align: "right" });
  }

  const clientSlug = slug(clientName) || "client";
  const fileName = isInvoice
    ? `invoice-${quote.invoice_number}-${clientSlug}.pdf`
    : `quote-${clientSlug}-${slug(quote.title)}.pdf`;
  doc.save(fileName);
}